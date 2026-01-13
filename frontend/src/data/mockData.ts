import type { Category } from '@/types/Category';
import type { Entry } from '@/types/Entry';
import { EntryType } from '@/types/EntryType';
import type { MonthlySummary } from '@/types/MonthlySummary';

export const mockCategories: Category[] = [
  {
    id: { value: 1 },
    name: 'Salary',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: { value: 2 },
    name: 'Groceries',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: { value: 3 },
    name: 'Transportation',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: { value: 4 },
    name: 'Entertainment',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: { value: 5 },
    name: 'Utilities',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];

export const mockEntries: Entry[] = [
  {
    id: { value: 1 },
    name: 'Monthly Salary',
    description: 'January salary payment',
    value: 5000,
    type: EntryType.INCOME,
    category: mockCategories[0],
    entryDate: '2025-01-05T00:00:00.000Z',
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-01-05T00:00:00.000Z',
  },
  {
    id: { value: 2 },
    name: 'Supermarket',
    description: 'Weekly groceries',
    value: -150,
    type: EntryType.EXPENSE,
    category: mockCategories[1],
    entryDate: '2025-01-08T00:00:00.000Z',
    createdAt: '2025-01-08T00:00:00.000Z',
    updatedAt: '2025-01-08T00:00:00.000Z',
  },
  {
    id: { value: 3 },
    name: 'Gas Station',
    description: 'Fuel for car',
    value: -60,
    type: EntryType.EXPENSE,
    category: mockCategories[2],
    entryDate: '2025-01-10T00:00:00.000Z',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: { value: 4 },
    name: 'Cinema Tickets',
    description: 'Movie night',
    value: -30,
    type: EntryType.EXPENSE,
    category: mockCategories[3],
    entryDate: '2025-01-12T00:00:00.000Z',
    createdAt: '2025-01-12T00:00:00.000Z',
    updatedAt: '2025-01-12T00:00:00.000Z',
  },
  {
    id: { value: 5 },
    name: 'Electricity Bill',
    description: 'Monthly electricity',
    value: -120,
    type: EntryType.EXPENSE,
    category: mockCategories[4],
    entryDate: '2025-01-13T00:00:00.000Z',
    createdAt: '2025-01-13T00:00:00.000Z',
    updatedAt: '2025-01-13T00:00:00.000Z',
  },
];

export const getMockSummary = (year: number, month: number): MonthlySummary => {
  const filteredEntries = mockEntries.filter((entry) => {
    const entryDate = new Date(entry.entryDate);
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  });

  const value = filteredEntries.reduce((sum, entry) => {
    return sum + (entry.type === EntryType.INCOME ? entry.value : entry.value);
  }, 0);

  return {
    value,
    entries: filteredEntries,
  };
};
