namespace backend.modules.budget.domain.entry;

public interface IEntryRepository
{
    public void Save(Entry entry);
    public void Delete(Entry entry);
    public IEnumerable<Entry> FindAllWithinDateRange(DateTime startDate, DateTime endDate);
}