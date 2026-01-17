import type { Entry } from '../types/Entry';
import type { HttpClient } from './httpClient.ts';

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
  return httpClient.post<Entry, Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>>('/Entries', entry);
};

export const updateEntry = async (
  httpClient: HttpClient,
  id: number,
  entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  await httpClient.put<void, Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>>(
    `/Entries/${id}`,
    entry
  );
};

export const deleteEntry = async (httpClient: HttpClient, id: number): Promise<void> => {
  await httpClient.delete<void>(`/Entries/${id}`);
};
