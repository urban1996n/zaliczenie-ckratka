import type { Category } from '../types/Category';
import { HttpClient } from './httpClient';

export const getCategories = async (httpClient: HttpClient): Promise<Category[]> => {
  return httpClient.get<Category[]>('/Categories');
};

export const getCategory = async (httpClient: HttpClient, id: number): Promise<Category> => {
  return httpClient.get<Category>(`/Categories/${id}`);
};

export const createCategory = async (
  httpClient: HttpClient,
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Category> => {
  return httpClient.post<Category, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>(
    '/Categories',
    category
  );
};

export const updateCategory = async (
  httpClient: HttpClient,
  id: number,
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  await httpClient.put<void, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>(
    `/Categories/${id}`,
    category
  );
};

export const deleteCategory = async (httpClient: HttpClient, id: number): Promise<void> => {
  await httpClient.delete<void>(`/Categories/${id}`);
};
