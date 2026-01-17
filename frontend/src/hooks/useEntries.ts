import { useState, useCallback } from 'react';
import { getEntries, createEntry, updateEntry, deleteEntry } from '../api/entries';
import type { Entry } from '../types/Entry';
import { useHttpClient } from '../context/HttpClientContext.tsx';

export const useEntries = () => {
  const httpClient = useHttpClient();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEntries(httpClient);
      setEntries(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = async (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);

    try {
      const newEntry = await createEntry(httpClient, entry);
      setEntries((prevEntries) => [...prevEntries, newEntry]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const editEntry = async (id: number, entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await updateEntry(httpClient, id, entry);
      await fetchEntries(); // Refetch entries to get the updated one
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const removeEntry = async (id: number) => {
    setLoading(true);
    try {
      await deleteEntry(httpClient, id);
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id.value !== id));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { entries, loading, error, fetchEntries, addEntry, editEntry, removeEntry };
};
