using backend.modules.shared.domain.valueObject;
using System;

namespace backend.modules.budget.domain.entry;

public interface IEntryRepository
{
    public void Save(Entry entry, Guid userId);
    public void Delete(Entry entry, Guid userId);
    public IEnumerable<Entry> FindAllWithinDateRange(DateTime startDate, DateTime endDate, Guid userId);
    public Entry? FindById(EntityId id, Guid userId);
}