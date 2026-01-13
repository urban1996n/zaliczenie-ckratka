import type { FC } from 'react';
import type { Category } from '@/types/Category';
import { CategoryModal } from '@/app/components/CategoryModal';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">Categories</h2>
        <button
          onClick={() => onOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No categories yet. Click "Add Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id.value} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onOpenModal(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(category.id.value)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onSubmit={onSubmit}
        category={selectedCategory}
      />
    </div>
  );
};
