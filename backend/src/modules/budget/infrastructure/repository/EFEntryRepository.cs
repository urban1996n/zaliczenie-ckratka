using backend.infrastructure.database;
using backend.modules.budget.domain.entry;
using backend.modules.budget.infrastructure.mapper;
using backend.modules.shared.domain.valueObject;
using Model = backend.modules.budget.infrastructure.model.Entry;
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
        Model? model = entry.Id != null 
            ? _context.Entries.FirstOrDefault(e => e.Id == entry.Id.Value)
            : null;
        if (model != null)
        {
            var updatedModel = _mapper.ToModel(entry);
            _context.Entry(model).CurrentValues.SetValues(updatedModel);
        }
        else
        {
            model = _mapper.ToModel(entry);
            _context.Entries.Add(model);
        }

        _context.SaveChanges();
        if (entry.Id != null || model.Id == null)
        {
            return;
        }

        entry.SetId(new EntityId(model.Id.Value));
    }

    public void Delete(Entry entry)
    {
        var entryModelToDelete = _context.Entries.Find(entry.Id.Value);
        if (entryModelToDelete != null)
        {
            _context.Entries.Remove(entryModelToDelete);
            _context.SaveChanges();
        }
    }

    public IEnumerable<Entry> FindAllWithinDateRange(DateTime startDate, DateTime endDate)
    {
        return _context.Entries
            .Where(e => e.EntryDate >= startDate && e.EntryDate <= endDate)
            .Select(e => _mapper.ToDomain(e))
            .ToList();
    }

    public Entry? FindById(EntityId id)
    {
        var model = _context.Entries.FirstOrDefault(e => e.Id == id.Value);
        return model == null ? null : _mapper.ToDomain(model);
    }
}