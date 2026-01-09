using backend.modules.budget.domain.category;
using backend.modules.shared.domain.valueObjects;

namespace backend.modules.budget.domain.entry;

public class Entry
{
    public EntityId? Id { get; private set; }
    public int Value { get; private set; }
    public Category? Category { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }

    public Type Type { get; private set; }

    public Entry(EntityId id, int value, Category? category, DateTime createdAt, DateTime? updatedAt, string name, string? description, Type type)
    {
        Id = id;
        Value = value;
        Category = category;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        Name = name;
        Description = description;
        Type = type;
    }

    public Entry(int value, Category? category, DateTime createdAt, string name, string? description, Type type)
    {
        Value = value;
        Category = category;
        CreatedAt = createdAt;
        Name = name;
        Description = description;
        Type = type;
    }

    public bool IsExpense()
    {
        return Type == Type.Expense;
    }

    public void SetValue(int value)
    {
        Value = value;
        UpdatedAt = DateTime.Now;
    }

    public void SetCategory(Category? category)
    {
        Category = category;
        UpdatedAt = DateTime.Now;
    }
    
    public void SetName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.Now;
    }

    public void SetDescription(string? description)
    {
        Description = description;
        UpdatedAt = DateTime.Now;
    }
    
    public void SetId(EntityId id)
    {
        if (Id != null)
        {
            throw new Exception("Id is already set");
        }
        
        Id = id;
        UpdatedAt = DateTime.Now;
    }

    public void SetType(Type type)
    {
        Type = type;
    }
}