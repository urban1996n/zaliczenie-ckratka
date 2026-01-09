import type { Category } from '../types/Category';
import { httpClient } from './httpClient';

export const getCategories = async (): Promise<Category[]> => {
  return httpClient.get<Category[]>('/api/Categories');
};

export const getCategory = async (id: number): Promise<Category> => {
  return httpClient.get<Category>(`/api/Categories/${id}`);
};

export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Category> => {
  return httpClient.post<Category, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>('/api/Categories', category);
};

export const updateCategory = async (
  id: number,
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  await httpClient.put<void, Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>(`/api/Categories/${id}`, category);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await httpClient.delete<void>(`/api/Categories/${id}`);
};
