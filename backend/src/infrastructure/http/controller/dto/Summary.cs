using backend.modules.budget.domain.entry;

namespace backend.infrastructure.http.controller.dto;

public class Summary
{
    public IEnumerable<Entry> Entries { get; set; }
    public int Value { get; set; }
}