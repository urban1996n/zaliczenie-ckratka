import type { FC } from 'react';
import type { Category } from '../../types/Category';
import { CategoryModal } from '../../components/Categories/CategoryModal';

interface CategoriesViewProps {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  onDelete: (id: number) => void;
  onOpenModal: (category?: Category) => void;
  onCloseModal: () => void;
  onSubmit: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isModalOpen: boolean;
  selectedCategory: Category | null;
}

export const CategoriesView: FC<CategoriesViewProps> = ({
  categories,
  loading,
  error,
  onDelete,
  onOpenModal,
  onCloseModal,
  onSubmit,
  isModalOpen,
  selectedCategory,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Categories</h2>
      <button onClick={() => onOpenModal()}>Add Category</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id.value}>
              <td>{category.name}</td>
              <td>{new Date(category.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onOpenModal(category)}>Edit</button>
                <button onClick={() => onDelete(category.id.value)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CategoryModal
        key={selectedCategory?.id.value || 'new'}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        category={selectedCategory}
      />
    </div>
  );
};
