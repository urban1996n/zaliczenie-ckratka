using backend.modules.shared.domain.valueObject;
using backend.modules.user.domain;
using System;

namespace backend.modules.budget.domain.category;

public class Category
{
    public EntityId Id { get; private set; }
    public string Name { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public Guid? UserId { get; private set; } // Make UserId nullable in domain as well

    public Category(EntityId id, string name, DateTime createdAt, DateTime? updatedAt, Guid? userId)
    {
        Id = id;
        Name = name;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        UserId = userId;
    }

    public void SetName(string name)
    {
        Name = name;
        UpdatedAt = DateTime.Now;
    }
}