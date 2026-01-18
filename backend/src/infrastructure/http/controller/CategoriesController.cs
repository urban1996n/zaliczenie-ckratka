using Microsoft.AspNetCore.Mvc;
using backend.modules.budget.domain.category;
using backend.modules.budget.infrastructure.mapper;
using backend.modules.shared.domain.valueObject;
using Model = backend.modules.budget.infrastructure.model.Category;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.infrastructure.http.controller
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly CategoryMapper _categoryMapper;

        public CategoriesController(ICategoryRepository categoryRepository, CategoryMapper categoryMapper)
        {
            _categoryRepository = categoryRepository;
            _categoryMapper = categoryMapper;
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
        public ActionResult<IEnumerable<Category>> GetAllCategories()
        {
            var userId = GetUserId();
            var categories = _categoryRepository.FindAll(userId);
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public ActionResult<Category> GetCategoryById(int id)
        {
            var userId = GetUserId();
            var category = _categoryRepository.FindById(new EntityId(id), userId);
            
            if (category == null) // Ownership check is now handled by the repository
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        public ActionResult<Category> CreateCategory([FromBody] CategoryDTO category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var newCategory = new Category(new EntityId(category.Id), category.Name, DateTime.UtcNow, null, userId);
            _categoryRepository.Save(newCategory, userId);

            return CreatedAtAction(nameof(GetCategoryById), new { id = newCategory.Id.Value }, newCategory);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] CategoryDTO category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            // The repository will handle finding and checking ownership
            var existingCategory = _categoryRepository.FindById(new EntityId(id), userId);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.SetName(category.Name); // Update domain model

            _categoryRepository.Save(existingCategory, userId);
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var userId = GetUserId();
            // The repository will handle finding and checking ownership
            var categoryToDelete = _categoryRepository.FindById(new EntityId(id), userId);
            if (categoryToDelete == null)
            {
                return NotFound();
            }

            _categoryRepository.Delete(categoryToDelete, userId);
            return NoContent();
        }
    }
}

public record CategoryDTO(int Id, string Name);