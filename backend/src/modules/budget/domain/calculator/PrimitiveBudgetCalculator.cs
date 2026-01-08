using backend.modules.budget.domain.entry;

namespace backend.modules.budget.domain.calculator;

public class PrimitiveBudgetCalculator: IBudgetCalculator
{
    public int Calculate(Entry[] entries)
    {
        int BudgetValue = 0;
        
        foreach (Entry entry in entries)
        {
            if (entry.IsExpense())
            {
                BudgetValue -= entry.GetValue();
                continue;
            }

            BudgetValue += entry.GetValue();
        }

        return BudgetValue;
    }
}