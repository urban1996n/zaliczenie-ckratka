using backend.modules.budget.domain.category;
using backend.modules.shared.domain.valueObjects;
using InfrastructureModel = backend.modules.budget.infrastructure.model;

namespace backend.modules.budget.infrastructure.mappers;

public class CategoryMapper
{
    public Category ToDomain(InfrastructureModel.Category model)
    {
        return new Category(
            new EntityId(model.Id),
            model.Name,
            model.CreatedAt,
            model.UpdatedAt
        );
    }

    public InfrastructureModel.Category ToModel(Category domain)
    {
        return new InfrastructureModel.Category
        {
            Id = domain.Id.Value,
            Name = domain.Name,
            CreatedAt = domain.CreatedAt,
            UpdatedAt = domain.UpdatedAt
        };
    }
}