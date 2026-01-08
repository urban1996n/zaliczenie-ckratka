using backend.infrastructure.database;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mappers;

namespace backend.modules.budget.infrastructure.repository;

public class EFEntryRepository: IEntryRepository
{
    private DefaultDatabaseContext _context;

    private EntryMapper _mapper;
    
    public EFEntryRepository(DefaultDatabaseContext  context, EntryMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public void Save(Entry entry)
    {
        _context.Entries.Add(_mapper.ToModel(entry));
    }

    public void Delete(Entry entry)
    {
        _context.Entries.Remove(_mapper.ToModel(entry));
    }

    public IEnumerable<Entry> FindAllWithinDateRange(DateTime startDate, DateTime endDate)
    {
        return _context.Entries
            .Where(e => e.CreatedAt >= startDate && e.CreatedAt <= endDate)
            .Select(e => _mapper.ToDomain(e))
            .ToList();
    }
}