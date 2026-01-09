namespace backend.modules.shared.domain.valueObject;

public class EntityId
{
    private int Id;

    public int Value
    {
        get => Id;
    }

    public EntityId(int id)
    {
        Id = id;
    }

    public int AsInt()
    {
        return Id;
    }
}