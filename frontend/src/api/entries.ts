import type { Entry } from '../types/Entry';
import { httpClient } from './httpClient';

export const getEntries = async (): Promise<Entry[]> => {
  return httpClient.get<Entry[]>('/api/Entries');
};

export const getEntry = async (id: number): Promise<Entry> => {
  return httpClient.get<Entry>(`/api/Entries/${id}`);
};

export const createEntry = async (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Promise<Entry> => {
  return httpClient.post<Entry, Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>>('/api/Entries', entry);
};

export const updateEntry = async (id: number, entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
  await httpClient.put<void, Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>>(`/api/Entries/${id}`, entry);
};

export const deleteEntry = async (id: number): Promise<void> => {
  await httpClient.delete<void>(`/api/Entries/${id}`);
};
