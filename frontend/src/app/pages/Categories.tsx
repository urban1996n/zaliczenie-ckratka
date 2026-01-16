import { type FC, useState, useEffect } from 'react';
import { CategoriesView } from './CategoriesView';
import { useCategories } from 'hooks/useCategories';
import type { Category } from 'types/Category';

export const Categories: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { categories, loading, error, fetchCategories, addCategory, editCategory, removeCategory } =
    useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await removeCategory(id);
    }
  };

  const handleOpenModal = (category?: Category) => {
    setSelectedCategory(category || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCategory) {
      await editCategory(selectedCategory.id.value, categoryData);
    } else {
      await addCategory(categoryData);
    }
    handleCloseModal();
  };

  return (
    <CategoriesView
      categories={categories}
      loading={loading}
      error={error}
      onDelete={handleDelete}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      selectedCategory={selectedCategory}
    />
  );
};
