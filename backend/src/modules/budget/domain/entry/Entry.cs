using backend.modules.budget.domain.category;
using backend.modules.shared.domain.valueObjects;

namespace backend.modules.budget.domain.entry;

public class Entry
{
    private readonly EntityId _id;
    private int _value;
    private Category? _category;
    private readonly DateTime _createdAt;
    private DateTime? _updatedAt;
    private string _name;
    private string? _description;
    private readonly Type _type;

    public Entry(EntityId id, int value, Category? category, DateTime createdAt, DateTime? updatedAt, string name, string? description, Type type)
    {
        _id = id;
        _value = value;
        _category = category;
        _createdAt = createdAt;
        _updatedAt = updatedAt;
        _name = name;
        _description = description;
        _type = type;
    }

    public bool IsExpense()
    {
        return _type == Type.Expense;
    }

    public EntityId GetId()
    {
        return _id;
    }
    
    public int GetValue()
    {
        return _value;
    }

    public void SetValue(int value)
    {
        _value = value;
        _updatedAt = DateTime.Now;
    }

    public Category? GetCategory()
    {
        return _category;
    }

    public void SetCategory(Category category)
    {
        _category = category;
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

    public string GetName()
    {
        return _name;
    }

    public void SetName(string name)
    {
        _name = name;
        _updatedAt = DateTime.Now;
    }

    public string? GetDescription()
    {
        return _description;
    }

    public void SetDescription(string? description)
    {
        _description = description;
        _updatedAt = DateTime.Now;
    }

    public Type GetEntryType()
    {
        return _type;
    }
}