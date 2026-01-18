using backend.modules.budget.domain.calculator;
using backend.modules.budget.domain.category;
using Microsoft.AspNetCore.Mvc;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mapper;
using backend.modules.shared.domain.valueObject;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Type = backend.modules.budget.domain.entry.Type;

namespace backend.infrastructure.http.controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EntriesController : ControllerBase
    {
        private readonly IEntryRepository _entryRepository;
        private readonly EntryMapper _entryMapper;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IBudgetCalculator _budgetCalculator;

        public EntriesController(IEntryRepository entryRepository, EntryMapper entryMapper, ICategoryRepository categoryRepository, IBudgetCalculator budgetCalculator)
        {
            _entryRepository = entryRepository;
            _entryMapper = entryMapper;
            _categoryRepository = categoryRepository;
            _budgetCalculator = budgetCalculator;
        }

        private Guid GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                throw new InvalidOperationException("User is not authenticated.");
            }
            return Guid.Parse(userId);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Entry>> GetAllEntries(DateTime? startDate, DateTime? endDate)
        {
            var userId = GetUserId();
            if (!startDate.HasValue)
            {
                startDate = DateTime.MinValue;
            }

            if (!endDate.HasValue)
            {
                endDate = DateTime.MaxValue;
            }
            var entries = _entryRepository.FindAllWithinDateRange(startDate.Value, endDate.Value, userId);
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public ActionResult<Entry> GetEntryById(int id)
        {
            var userId = GetUserId();
            var entry = _entryRepository.FindById(new EntityId(id), userId);
            
            if (entry == null) // Ownership check is now handled by the repository
            {
                return NotFound();
            }
            return Ok(entry);
        }

        [HttpPost]
        public ActionResult<Entry> CreateEntry([FromBody] EntryDTO entry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            int? categoryId = entry.CategoryId;
            EntityId? entityId = categoryId.HasValue ? new EntityId(categoryId.Value) : null; 
            var category =  entityId == null ? null : _categoryRepository.FindById(entityId, userId); // Pass userId to category repository
            // Ensure the category belongs to the user if it exists
            if (category != null && category.UserId != userId)
            {
                return Forbid(); // Or BadRequest, depending on desired behavior
            }
            var newEntry = new Entry(entry.Value, category, DateTime.UtcNow, entry.Name, entry.Description, entry.Type, DateTime.Parse(entry.EntryDate), userId);
            _entryRepository.Save(newEntry, userId);

            return CreatedAtAction(nameof(GetEntryById), new { id = newEntry?.Id?.Value }, newEntry);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEntry(int id, [FromBody] EntryDTO entry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            // The repository will handle finding and checking ownership
            var existingEntry = _entryRepository.FindById(new EntityId(id), userId);
            if (existingEntry == null)
            {
                return NotFound();
            }

            var category = entry.CategoryId == null ? null : _categoryRepository.FindById(new EntityId(entry.CategoryId.Value), userId); // Pass userId to category repository
            // Ensure the category belongs to the user if it exists
            if (category != null && category.UserId != userId)
            {
                return Forbid(); // Or BadRequest, depending on desired behavior
            }

            existingEntry.SetValue(entry.Value);
            existingEntry.SetCategory(category);
            existingEntry.SetName(entry.Name);
            existingEntry.SetDescription(entry.Description);
            existingEntry.SetType(entry.Type);
            existingEntry.SetEntryDate(DateTime.Parse(entry.EntryDate));
            _entryRepository.Save(existingEntry, userId); 

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEntry(int id)
        {
            var userId = GetUserId();
            // The repository will handle finding and checking ownership
            var entryToDelete = _entryRepository.FindById(new EntityId(id), userId);
            if (entryToDelete == null)
            {
                return NotFound();
            }

            _entryRepository.Delete(entryToDelete, userId);
            return NoContent();
        }

        [HttpGet("summary")]
        public IActionResult GetSummary(
            [FromQuery] DateTime dateFrom,
            [FromQuery] DateTime dateTo)
        {
            if (dateFrom > dateTo)
                return BadRequest("dateFrom cannot be later than dateTo");
            
            var userId = GetUserId();
            var entries = _entryRepository.FindAllWithinDateRange(dateFrom, dateTo, userId);
            var summary = new Summary(entries, _budgetCalculator.Calculate(entries));

            return Ok(summary);
        }
    }
}

public record EntryDTO(string Name, string? Description, int? CategoryId, int Value, Type Type, string EntryDate);
public record Summary(IEnumerable<Entry> Entries, int Value); 