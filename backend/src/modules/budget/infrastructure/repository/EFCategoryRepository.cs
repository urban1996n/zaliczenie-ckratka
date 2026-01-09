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

    public void Save(Category category)
    {
        var existingModel = _context.Categories.FirstOrDefault(c => c.Id == category.Id.Value);
        if (existingModel != null)
        {
            var updatedModel = _mapper.ToModel(category);
            _context.Entry(existingModel).CurrentValues.SetValues(updatedModel);
        }
        else
        {
            _context.Categories.Add(_mapper.ToModel(category));
        }
        _context.SaveChanges();
    }

    public void Delete(Category category)
    {
        var categoryModelToDelete = _context.Categories.Find(category.Id.Value);
        if (categoryModelToDelete != null)
        {
            _context.Categories.Remove(categoryModelToDelete);
            _context.SaveChanges();
        }
    }

    public IEnumerable<Category> FindAll()
    {
        return _context.Categories.Select(_mapper.ToDomain).ToList();
    }

    public Category? FindById(EntityId id)
    {
        var model = _context.Categories.FirstOrDefault(c => c.Id == id.Value);
        return model == null ? null : _mapper.ToDomain(model);
    }
}