using backend.modules.budget.domain.entry;

namespace backend.modules.budget.domain.calculator;

public interface IBudgetCalculator
{
    public int Calculate(Entry[] entry);
}