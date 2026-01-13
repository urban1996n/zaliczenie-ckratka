import { type FC, useEffect, useState } from 'react';
import { useEntries } from '../../hooks/useEntries';
import { useCategories } from '../../hooks/useCategories';
import EntriesView from './EntriesView';
import type { Entry } from '../../types/Entry';

export const Entries: FC = () => {
  const [date, setDate] = useState(new Date());
  const { entries, loading, error, fetchEntries, removeEntry, addEntry, editEntry } = useEntries();
  const { categories, fetchCategories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, [fetchEntries, fetchCategories]);

  const onNextMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const onPrevMonth = () => {
    setDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleOpenModal = (entry?: Entry) => {
    setSelectedEntry(entry || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEntry) {
      editEntry(selectedEntry.id.value, entryData);
    } else {
      addEntry(entryData);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.entryDate);
    return (
      entryDate.getFullYear() === date.getFullYear() &&
      entryDate.getMonth() === date.getMonth()
    );
  });

  return (
    <EntriesView
      entries={filteredEntries}
      loading={loading}
      error={error}
      onNextMonth={onNextMonth}
      onPrevMonth={onPrevMonth}
      onDelete={removeEntry}
      currentDate={date}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      selectedEntry={selectedEntry}
      categories={categories}
    />
  );
};
