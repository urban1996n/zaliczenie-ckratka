
using backend.modules.shared.domain.valueObject;
using InfrastructureModel = backend.modules.budget.infrastructure.model;
using DomainEntry = backend.modules.budget.domain.entry.Entry;
using DomainCategory = backend.modules.budget.domain.category.Category;

namespace backend.modules.budget.infrastructure.mapper;

public class EntryMapper
{
    private CategoryMapper _categoryMapper;

    public EntryMapper(CategoryMapper categoryMapper)
    {
        _categoryMapper = categoryMapper;
    }

    public DomainEntry ToDomain(InfrastructureModel.Entry model)
    {
        DomainCategory? domainCategory = null;
        if (model.Category != null)
        {
            domainCategory = _categoryMapper.ToDomain(model.Category);
        }

        if (model.Id == null)
        {
            return new DomainEntry(
                model.Value,
                domainCategory,
                DateTime.UtcNow,
                model.Name,
                model.Description,
                model.Type,
                model.EntryDate
            );
        }

        return new DomainEntry(
            new EntityId(model.Id.Value),
            (int)model.Value,
            domainCategory,
            model.CreatedAt,
            model.UpdatedAt,
            model.Name,
            model.Description,
            model.Type,
            model.EntryDate
        );
    }

    public InfrastructureModel.Entry ToModel(DomainEntry domain)
    {
        InfrastructureModel.Category? category = null;
        DomainCategory? domainCategory = domain.Category;

        if (domainCategory != null)
        {
            category = _categoryMapper.ToModel(domainCategory);
        }

        int? entryId = domain.Id != null ? domain.Id.Value : null;
        
        return new InfrastructureModel.Entry
        {
            Id = entryId,
            Name = domain.Name,
            Description = domain.Description,
            CreatedAt = domain.CreatedAt,
            UpdatedAt = domain.UpdatedAt,
            Category = category,
            Value = domain.Value,
            Type = domain.Type,
            EntryDate = domain.EntryDate
        };
    }
}
