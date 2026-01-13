import { FC, useState } from 'react';
import { CategoriesView } from './CategoriesView';
import { mockCategories } from '@/data/mockData';
import type { Category } from '@/types/Category';

export const Categories: FC = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((category) => category.id.value !== id));
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

  const handleSubmit = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((category) =>
          category.id.value === selectedCategory.id.value
            ? {
                ...category,
                ...categoryData,
                updatedAt: new Date().toISOString(),
              }
            : category
        )
      );
    } else {
      // Create new category
      const newCategory: Category = {
        ...categoryData,
        id: { value: Math.max(...categories.map((c) => c.id.value), 0) + 1 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  return (
    <CategoriesView
      categories={categories}
      loading={false}
      error={null}
      onDelete={handleDelete}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      selectedCategory={selectedCategory}
    />
  );
};
