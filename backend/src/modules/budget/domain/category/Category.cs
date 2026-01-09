using backend.modules.shared.domain.valueObject;

namespace backend.modules.budget.domain.category;

public class Category
{
    public EntityId Id { get; private set; }
    public string Name { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    
    public Category(EntityId id, string name, DateTime createdAt, DateTime? updatedAt)
    {
        Id = id;
        Name = name;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public void SetName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.Now;
    }
}