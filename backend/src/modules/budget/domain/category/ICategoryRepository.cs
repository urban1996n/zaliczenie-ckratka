namespace backend.modules.budget.domain.category;

public interface ICategoryRepository
{
    public void Delete(Category category);
    public void Save(Category category);
    public IEnumerable<Category> FindAll();
}