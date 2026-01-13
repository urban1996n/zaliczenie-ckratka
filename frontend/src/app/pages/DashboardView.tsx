import type { FC } from 'react';
import type { MonthlySummary } from '@/types/MonthlySummary';
import { EntryType } from '@/types/EntryType';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardViewProps {
  summary: MonthlySummary | null;
  loading: boolean;
  error: Error | null;
}

export const DashboardView: FC<DashboardViewProps> = ({ summary, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600">No summary data</p>
      </div>
    );
  }

  const income = summary.entries
    .filter((e) => e.type === EntryType.INCOME)
    .reduce((acc, e) => acc + e.value, 0);
  const expense = summary.entries
    .filter((e) => e.type === EntryType.EXPENSE)
    .reduce((acc, e) => acc + Math.abs(e.value), 0);
  
  const total = income - expense;
  const incomePercentage = income + expense > 0 ? (income / (income + expense)) * 100 : 50;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl">Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl mt-2">${income.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expense</p>
              <p className="text-2xl mt-2">${expense.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`text-2xl mt-2 ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(total).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl mb-6">Income vs Expense</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: `conic-gradient(
                  #10b981 0% ${incomePercentage}%,
                  #ef4444 ${incomePercentage}% 100%
                )`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl mt-1">${(income + expense).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
            <span className="text-gray-700">Income (${income.toLocaleString()})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-red-500 mr-2"></div>
            <span className="text-gray-700">Expense (${expense.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl mb-4">Recent Entries</h3>
        {summary.entries.length === 0 ? (
          <p className="text-gray-500">No entries for this month</p>
        ) : (
          <div className="space-y-3">
            {summary.entries.slice(0, 5).map((entry) => (
              <div
                key={entry.id.value}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p>{entry.name}</p>
                  <p className="text-sm text-gray-500">{entry.category?.name || 'Uncategorized'}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg ${
                      entry.type === EntryType.INCOME ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {entry.type === EntryType.INCOME ? '+' : '-'}$
                    {Math.abs(entry.value).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.entryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
