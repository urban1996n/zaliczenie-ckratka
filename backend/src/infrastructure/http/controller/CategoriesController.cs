using Microsoft.AspNetCore.Mvc;
using backend.modules.budget.domain.category;
using backend.modules.budget.infrastructure.mappers;
using backend.modules.shared.domain.valueObjects;
using Model = backend.modules.budget.infrastructure.model.Category;

namespace backend.infrastructure.http.controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly CategoryMapper _categoryMapper;

        public CategoriesController(ICategoryRepository categoryRepository, CategoryMapper categoryMapper)
        {
            _categoryRepository = categoryRepository;
            _categoryMapper = categoryMapper;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetAllCategories()
        {
            var categories = _categoryRepository.FindAll();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public ActionResult<Category> GetCategoryById(int id)
        {
            var category = _categoryRepository.FindById(new EntityId(id));
            
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost]
        public ActionResult<Category> CreateCategory([FromBody] Model category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ensure the incoming category has a new ID
            category.CreatedAt = DateTime.UtcNow;
            var newCategory = _categoryMapper.ToDomain(category);
            _categoryRepository.Save(newCategory);

            return CreatedAtAction(nameof(GetCategoryById), new { id = newCategory.Id.Value }, newCategory);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] Model category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (category.Id != id)
            {
                return BadRequest("Category ID in the body does not match the route ID.");
            }

            var existingCategory = _categoryRepository.FindById(new EntityId(id));
            if (existingCategory == null)
            {
                return NotFound();
            }

            // Update properties
            existingCategory.SetName(category.Name);

            _categoryRepository.Save(existingCategory); // Assuming Save can handle updates now.

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var categoryToDelete = _categoryRepository.FindById(new EntityId(id));
            if (categoryToDelete == null)
            {
                return NotFound();
            }

            _categoryRepository.Delete(categoryToDelete);
            return NoContent();
        }
    }
}