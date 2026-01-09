import type { FC } from 'react';
import type { Entry } from '../../types/Entry';
import type { Category } from '../../types/Category';
import { EntryType } from '../../types/EntryType';
import { EntryModal } from '../../components/Entries/EntryModal';

interface EntriesViewProps {
  entries: Entry[];
  loading: boolean;
  error: Error | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDelete: (id: number) => void;
  currentDate: Date;
  onOpenModal: (entry?: Entry) => void;
  onCloseModal: () => void;
  onSubmit: (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isModalOpen: boolean;
  selectedEntry: Entry | null;
  categories: Category[];
}

export const EntriesView: FC<EntriesViewProps> = ({
  entries,
  loading,
  error,
  onPrevMonth,
  onNextMonth,
  onDelete,
  currentDate,
  onOpenModal,
  onCloseModal,
  onSubmit,
  isModalOpen,
  selectedEntry,
  categories,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Entries for {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
      <div>
        <button onClick={onPrevMonth}>Previous Month</button>
        <button onClick={onNextMonth}>Next Month</button>
      </div>
      <button onClick={() => onOpenModal()}>Add Entry</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Value</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id.value}>
              <td>{entry.name}</td>
              <td>{entry.description}</td>
              <td>{entry.value}</td>
              <td>{entry.type === EntryType.INCOME ? 'Income' : 'Expense'}</td>
              <td>{entry.category?.name}</td>
              <td>{new Date(entry.entryDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onOpenModal(entry)}>Edit</button>
                <button onClick={() => onDelete(entry.id.value)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EntryModal
        key={selectedEntry?.id.value || 'new'}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        entry={selectedEntry}
        categories={categories}
      />
    </div>
  );
};
