import { useState, useCallback } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import type { Category } from '../types/Category';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newCategory = await createCategory(category);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async (id: number, category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await updateCategory(id, category);
      await fetchCategories(); // Refetch categories to get the updated one
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: number) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id.value !== id));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, fetchCategories, addCategory, editCategory, removeCategory };
};
