namespace backend.infrastructure.http.controller.dto;
using backend.modules.budget.domain.entry;

public class EntryDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int? CategoryId { get; set; }
    public int Value { get; set; }
    public Type Type { get; set; }
    
    public DateTime Date { get; set; }
}