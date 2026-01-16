import type { ReactElement } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Category as CategoryModel } from '../../types/Category.ts';

interface CategoryProps {
  category: CategoryModel;
  onOpenModal(category: CategoryModel): void;
  onDelete(categoryId: number): void;
}
export const Category = ({ category, onOpenModal, onDelete }: CategoryProps): ReactElement => (
  <>
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
  </>
);
