import { type FC, useState, useEffect } from 'react';
import { EntriesView } from './EntriesView';
import { useEntries } from 'hooks/useEntries';
import { useCategories } from 'hooks/useCategories';
import type { Entry } from 'types/Entry';
import { useMonthlySummary } from 'hooks/useMonthlySummary.ts';

export const Entries: FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const { fetchSummary, summary } = useMonthlySummary(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const {
    loading: entriesLoading,
    error: entriesError,
    addEntry,
    editEntry,
    removeEntry,
  } = useEntries();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategories,
  } = useCategories();

  useEffect(() => {
    fetchSummary();
    fetchCategories();
  }, [fetchSummary, fetchCategories]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await removeEntry(id);
      fetchSummary();
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

  const handleSubmit = async (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEntry) {
      await editEntry(selectedEntry.id.value, entryData);
    } else {
      await addEntry(entryData);
    }

    fetchSummary();
    handleCloseModal();
  };

  const loading = entriesLoading || categoriesLoading;
  const error = entriesError || categoriesError;

  return (
    <EntriesView
      entries={summary?.entries ?? []}
      loading={loading}
      error={error}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onDelete={handleDelete}
      currentDate={currentDate}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      selectedEntry={selectedEntry}
      categories={categories}
    />
  );
};
