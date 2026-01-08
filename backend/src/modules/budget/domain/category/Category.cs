using backend.modules.shared.domain.valueObjects;

namespace backend.modules.budget.domain.category;

public class Category
{
    private EntityId _id;
    private string _name;
    private readonly DateTime _createdAt;
    private DateTime? _updatedAt;

    public Category(EntityId id, string name, DateTime createdAt, DateTime? updatedAt)
    {
        _id = id;
        _name = name;
        _createdAt = createdAt;
        _updatedAt = updatedAt;
    }

    public EntityId GetId()
    {
        return _id;
    }

    public string GetName()
    {
        return _name;
    }

    public void SetName(string name)
    {
        _name = name;
        _updatedAt = DateTime.Now;
    }
    
    public DateTime GetCreatedAt()
    {
        return _createdAt;
    }
    
    public DateTime? GetUpdatedAt()
    {
        return _updatedAt;
    }
}