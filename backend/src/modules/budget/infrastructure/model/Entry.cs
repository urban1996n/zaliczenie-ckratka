namespace backend.modules.budget.infrastructure.model;

using backend.modules.budget.domain.entry;

public class Entry
{
    public int? Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Category? Category { get; set; }
    public int Value { get; set; }
    public Type Type { get; set; }
}