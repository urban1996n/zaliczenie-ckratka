using backend.infrastructure.http.controller.dto;
using backend.modules.budget.domain.calculator;
using backend.modules.budget.domain.category;
using Microsoft.AspNetCore.Mvc;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mapper;
using backend.modules.shared.domain.valueObject;
using Model =  backend.modules.budget.infrastructure.model.Entry;

namespace backend.infrastructure.http.controller
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpGet]
        public ActionResult<IEnumerable<Entry>> GetAllEntries(DateTime? startDate, DateTime? endDate)
        {
            if (!startDate.HasValue)
            {
                startDate = DateTime.MinValue;
            }

            if (!endDate.HasValue)
            {
                endDate = DateTime.MaxValue;
            }
            var entries = _entryRepository.FindAllWithinDateRange(startDate.Value, endDate.Value);
            return Ok(entries);
        }

        [HttpGet("{id}")]
        public ActionResult<Entry> GetEntryById(int id)
        {
            var entry = _entryRepository.FindById(new EntityId(id));
            
            if (entry == null)
            {
                return NotFound();
            }
            return Ok(entry);
        }

        [HttpPost]
        public ActionResult<Entry> CreateEntry([FromBody] EntryDto entry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? categoryId = entry.CategoryId;
            EntityId? entityId = categoryId.HasValue ? new EntityId(categoryId.Value) : null; 
            var category =  entityId == null ? null : _categoryRepository.FindById(entityId);
            var newEntry = new Entry(entry.Value, category, DateTime.UtcNow, entry.Name, entry.Description, entry.Type, entry.Date);
            _entryRepository.Save(newEntry);

            return CreatedAtAction(nameof(GetEntryById), new { id = newEntry?.Id?.Value }, newEntry);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEntry(int id, [FromBody] EntryDto entry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingEntry = _entryRepository.FindById(new EntityId(id));
            if (existingEntry == null)
            {
                return NotFound();
            }

            var category = entry.CategoryId == null ? null : _categoryRepository.FindById(new EntityId(entry.CategoryId.Value));
            existingEntry.SetValue(entry.Value);
            existingEntry.SetCategory(category);
            existingEntry.SetName(entry.Name);
            existingEntry.SetDescription(entry.Description);
            existingEntry.SetType(entry.Type);
            existingEntry.SetEntryDate(entry.Date);
            _entryRepository.Save(existingEntry); 

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEntry(int id)
        {
            var entryToDelete = _entryRepository.FindById(new EntityId(id));
            if (entryToDelete == null)
            {
                return NotFound();
            }

            _entryRepository.Delete(entryToDelete);
            return NoContent();
        }

        [HttpGet("summary")]
        public IActionResult GetSummary(
            [FromQuery] DateTime dateFrom,
            [FromQuery] DateTime dateTo)
        {
            if (dateFrom > dateTo)
                return BadRequest("dateFrom cannot be later than dateTo");
            
            var entries = _entryRepository.FindAllWithinDateRange(dateFrom, dateTo);
            var summary = new Summary();
            summary.Entries = entries;
            summary.Value = _budgetCalculator.Calculate(entries);
            
            return Ok(summary);
        }
    }
}