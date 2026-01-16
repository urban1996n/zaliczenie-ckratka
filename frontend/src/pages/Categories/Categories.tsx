import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useCategories } from 'hooks/useCategories';
import CategoriesView from './CategoriesView';
import type { Category } from '../../types/Category';

export const Categories: FC = () => {
  const { categories, loading, error, fetchCategories, removeCategory, addCategory, editCategory } =
    useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCategory) {
      editCategory(selectedCategory.id.value, categoryData);
    } else {
      addCategory(categoryData);
    }
  };

  return (
    <CategoriesView
      categories={categories}
      loading={loading}
      error={error}
      onDelete={removeCategory}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      selectedCategory={selectedCategory}
    />
  );
};
