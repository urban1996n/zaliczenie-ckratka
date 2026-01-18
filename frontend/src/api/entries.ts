import type { Entry } from '../types/Entry';
import type { HttpClient } from './httpClient.ts';

interface EntryRequest extends Omit<Entry, 'id' | 'createdAt' | 'updatedAt' | 'category'> {
  categoryId?: number;
}

export const getEntries = async (httpClient: HttpClient): Promise<Entry[]> => {
  return httpClient.get<Entry[]>('/Entries');
};

export const getEntry = async (httpClient: HttpClient, id: number): Promise<Entry> => {
  return httpClient.get<Entry>(`/Entries/${id}`);
};

export const createEntry = async (
  httpClient: HttpClient,
  entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Entry> => {
  return httpClient.post<Entry, EntryRequest>('/Entries', {
    ...entry,
    categoryId: entry.category?.id.value,
  });
};

export const updateEntry = async (
  httpClient: HttpClient,
  id: number,
  entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  await httpClient.put<void, EntryRequest>(`/Entries/${id}`, {
    ...entry,
    categoryId: entry.category?.id.value,
  });
};

export const deleteEntry = async (httpClient: HttpClient, id: number): Promise<void> => {
  await httpClient.delete<void>(`/Entries/${id}`);
};
