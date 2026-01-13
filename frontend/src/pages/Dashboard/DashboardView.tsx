import type { FC } from 'react';
import type { MonthlySummary } from '../../types/MonthlySummary';
import { EntryType } from '../../types/EntryType';
import { withLoader } from '../../components/common/withLoader';

interface DashboardViewProps {
  summary: MonthlySummary | null;
}

const DashboardView: FC<DashboardViewProps> = ({ summary }) => {
  if (!summary) {
    return <div>No summary data</div>;
  }

  const income = summary.entries
    .filter((e) => e.type === EntryType.INCOME)
    .reduce((acc, e) => acc + e.value, 0);
  const expense = summary.entries
    .filter((e) => e.type === EntryType.EXPENSE)
    .reduce((acc, e) => acc + e.value, 0);
  const total = income + expense;
  const incomePercentage = total > 0 ? (income / total) * 100 : 0;

  const pieChartStyle = {
    background: `conic-gradient(
      green 0% ${incomePercentage}%,
      red ${incomePercentage}% 100%
    )`,
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Monthly Summary</h3>
        <p>Total Income: {income}</p>
        <p>Total Expense: {expense}</p>
        <p>Total Value: {summary.value}</p>
      </div>
      <div>
        <h3>Summary Chart</h3>
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            ...pieChartStyle,
          }}
        ></div>
        <div>
          <span style={{ color: 'green' }}>Income</span>
          <span style={{ color: 'red' }}>Expense</span>
        </div>
      </div>
    </div>
  );
};

export default withLoader(DashboardView);
