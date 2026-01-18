using backend.infrastructure.database;
using backend.modules.budget.domain.category;
using backend.modules.budget.infrastructure.mapper;
using backend.modules.shared.domain.valueObject;

namespace backend.modules.budget.infrastructure.repository;

public class EFCategoryRepository: ICategoryRepository
{
    private CategoryMapper _mapper;
    private DefaultDatabaseContext _context;
    
    public EFCategoryRepository(DefaultDatabaseContext  context, CategoryMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public void Save(Category category, Guid userId)
    {
        var existingModel = _context.Categories.FirstOrDefault(c => c.Id == category.Id.Value && c.UserId == userId);
        var modelToSave = _mapper.ToModel(category);
        modelToSave.UserId = userId; // Ensure UserId is set on the model to be saved

        if (existingModel != null)
        {
            _context.Entry(existingModel).CurrentValues.SetValues(modelToSave);
        }
        else
        {
            _context.Categories.Add(modelToSave);
        }
        _context.SaveChanges();
    }

    public void Delete(Category category, Guid userId)
    {
        var categoryModelToDelete = _context.Categories.FirstOrDefault(c => c.Id == category.Id.Value && c.UserId == userId);
        if (categoryModelToDelete != null)
        {
            _context.Categories.Remove(categoryModelToDelete);
            _context.SaveChanges();
        }
    }

    public IEnumerable<Category> FindAll(Guid userId)
    {
        return _context.Categories.Where(c => c.UserId == userId).Select(_mapper.ToDomain).ToList();
    }

    public Category? FindById(EntityId id, Guid userId)
    {
        var model = _context.Categories.FirstOrDefault(c => c.Id == id.Value && c.UserId == userId);
        return model == null ? null : _mapper.ToDomain(model);
    }
}