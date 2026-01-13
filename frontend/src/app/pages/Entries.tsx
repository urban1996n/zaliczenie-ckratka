import { FC, useState } from 'react';
import { EntriesView } from './EntriesView';
import { mockCategories, mockEntries } from '@/data/mockData';
import type { Entry } from '@/types/Entry';

export const Entries: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entries, setEntries] = useState(mockEntries);

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.entryDate);
    return (
      entryDate.getFullYear() === currentDate.getFullYear() &&
      entryDate.getMonth() === currentDate.getMonth()
    );
  });

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries((prev) => prev.filter((entry) => entry.id.value !== id));
    }
  };

  const handleOpenModal = (entry?: Entry) => {
    setSelectedEntry(entry || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleSubmit = (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEntry) {
      // Update existing entry
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id.value === selectedEntry.id.value
            ? {
                ...entry,
                ...entryData,
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
    } else {
      // Create new entry
      const newEntry: Entry = {
        ...entryData,
        id: { value: Math.max(...entries.map((e) => e.id.value), 0) + 1 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, newEntry]);
    }
  };

  return (
    <EntriesView
      entries={filteredEntries}
      loading={false}
      error={null}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onDelete={handleDelete}
      currentDate={currentDate}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      selectedEntry={selectedEntry}
      categories={mockCategories}
    />
  );
};
