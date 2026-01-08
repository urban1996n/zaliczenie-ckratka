using backend.infrastructure.database;
using backend.modules.budget.domain.category;
using backend.modules.budget.infrastructure.mappers;

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
        _context.Categories.Add(_mapper.ToModel(category));
        _context.SaveChanges();
    }

    public void Delete(Category category)
    {
        _context.Categories.Remove(_mapper.ToModel(category));
        _context.SaveChanges();
    }

    public IEnumerable<Category> FindAll()
    {
        return _context.Categories.Select(_mapper.ToDomain).ToList();
    }
}