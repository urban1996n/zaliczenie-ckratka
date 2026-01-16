import type { FC } from 'react';
import type { Category as CategoryModel } from 'types/Category';
import { CategoryModal } from 'app/components/CategoryModal';
import { LoadingErrorWrapper } from 'app/components/common/LoadingErrorWrapper';
import { PageHeader } from 'app/components/common/PageHeader';
import { Category } from './Category.tsx';

interface CategoriesViewProps {
  categories: CategoryModel[];
  loading: boolean;
  error: Error | null;
  onDelete: (id: number) => void;
  onOpenModal: (category?: CategoryModel) => void;
  onCloseModal: () => void;
  onSubmit: (categoryData: Omit<CategoryModel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isModalOpen: boolean;
  selectedCategory: CategoryModel | null;
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
  return (
    <LoadingErrorWrapper loading={loading} error={error}>
      <div className="space-y-6">
        <PageHeader title="Categories" buttonText="Add Category" onAddClick={() => onOpenModal()} />

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
                  categories.map((category, key) => (
                    <Category
                      category={category}
                      onDelete={onDelete}
                      onOpenModal={onOpenModal}
                      key={`category__row--a${key}`}
                    />
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
    </LoadingErrorWrapper>
  );
};
