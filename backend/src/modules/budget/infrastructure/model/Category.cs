using backend.modules.user.domain;

namespace backend.modules.budget.infrastructure.model;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Guid? UserId { get; set; }
    public User User { get; set; } = null!;
}