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

    public void Save(Entry entry, Guid userId)
    {
        Model? model = entry.Id != null 
            ? _context.Entries.FirstOrDefault(e => e.Id == entry.Id.Value && e.UserId == userId)
            : null;

        var modelToSave = _mapper.ToModel(entry);
        modelToSave.UserId = userId; // Ensure UserId is set on the model to be saved

        if (model != null)
        {
            _context.Entry(model).CurrentValues.SetValues(modelToSave);
        }
        else
        {
            _context.Entries.Add(modelToSave);
        }

        _context.SaveChanges();
        if (entry.Id != null || modelToSave.Id == null)
        {
            return;
        }

        entry.SetId(new EntityId(modelToSave.Id.Value));
    }

    public void Delete(Entry entry, Guid userId)
    {
        var entryModelToDelete = _context.Entries.FirstOrDefault(e => e.Id == entry.Id.Value && e.UserId == userId);
        if (entryModelToDelete != null)
        {
            _context.Entries.Remove(entryModelToDelete);
            _context.SaveChanges();
        }
    }

    public IEnumerable<Entry> FindAllWithinDateRange(DateTime startDate, DateTime endDate, Guid userId)
    {
        return _context.Entries
            .Where(e => e.EntryDate >= startDate && e.EntryDate <= endDate && e.UserId == userId)
            .Select(e => _mapper.ToDomain(e))
            .ToList();
    }

    public Entry? FindById(EntityId id, Guid userId)
    {
        var model = _context.Entries.FirstOrDefault(e => e.Id == id.Value && e.UserId == userId);
        return model == null ? null : _mapper.ToDomain(model);
    }
}