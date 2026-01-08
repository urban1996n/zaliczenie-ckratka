
using backend.modules.shared.domain.valueObjects;
using InfrastructureModel = backend.modules.budget.infrastructure.model;
using DomainEntry = backend.modules.budget.domain.entry.Entry;
using DomainCategory = backend.modules.budget.domain.category.Category;

namespace backend.modules.budget.infrastructure.mappers;

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

        return new DomainEntry(
            new EntityId(model.Id),
            (int)model.Value,
            domainCategory,
            model.CreatedAt,
            model.UpdatedAt,
            model.Name,
            model.Description,
            model.Type
        );
    }

    public InfrastructureModel.Entry ToModel(DomainEntry domain)
    {
        InfrastructureModel.Category? category = null;
        DomainCategory? domainCategory = domain.GetCategory();

        if (domainCategory != null)
        {
            category = _categoryMapper.ToModel(domainCategory);
        }

        return new InfrastructureModel.Entry
        {
            Id = domain.GetId().AsInt(),
            Name = domain.GetName(),
            Description = domain.GetDescription(),
            CreatedAt = domain.GetCreatedAt(),
            UpdatedAt = domain.GetUpdatedAt(),
            Category = category,
            Value = (uint)domain.GetValue(),
            Type = domain.GetEntryType()
        };
    }
}
