using backend.modules.budget.domain.category;
using Microsoft.AspNetCore.Mvc;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mappers;
using backend.modules.shared.domain.valueObjects;
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

        public EntriesController(IEntryRepository entryRepository, EntryMapper entryMapper, ICategoryRepository categoryRepository)
        {
            _entryRepository = entryRepository;
            _entryMapper = entryMapper;
            _categoryRepository = categoryRepository;
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
        public ActionResult<Entry> CreateEntry([FromBody] Model entry)
        {
            var newEntry = _entryMapper.ToDomain(entry);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _entryRepository.Save(newEntry);
            return CreatedAtAction(nameof(GetEntryById), new { id = newEntry.GetId().Value }, newEntry);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEntry(int id, [FromBody] Model entry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (entry.Id != id)
            {
                return BadRequest("Entry ID in the body does not match the route ID.");
            }

            var existingEntry = _entryRepository.FindById(new EntityId(id));
            if (existingEntry == null)
            {
                return NotFound();
            }
            
            existingEntry.SetValue(entry.Value);
            existingEntry.SetCategory(_categoryRepository.FindById(new EntityId(entry.Category.Id)));
            // Update properties
            // existingEntry.Amount = entry.Amount;
            // existingEntry.Comment = entry.Comment;
            // existingEntry.CreatedAt = entry.CreatedAt;
            // existingEntry.Type = entry.Type;
            // existingEntry.CategoryId = entry.CategoryId;

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
    }
}