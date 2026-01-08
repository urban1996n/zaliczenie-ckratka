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
            System.DateTime.Now, // Assuming CreatedAt is not in the model, initialize it.
            null // Assuming UpdatedAt is not in the model, initialize it.
        );
    }

    public InfrastructureModel.Category ToModel(Category domain)
    {
        return new InfrastructureModel.Category
        {
            Id = domain.GetId().AsInt(),
            Name = domain.GetName()
        };
    }
}