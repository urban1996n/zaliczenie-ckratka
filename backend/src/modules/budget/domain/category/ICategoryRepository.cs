using backend.modules.shared.domain.valueObject;
using System;

namespace backend.modules.budget.domain.category;

public interface ICategoryRepository
{
    public void Delete(Category category, Guid userId);
    public void Save(Category category, Guid userId);
    public IEnumerable<Category> FindAll(Guid userId);
    public Category? FindById(EntityId id, Guid userId);
}