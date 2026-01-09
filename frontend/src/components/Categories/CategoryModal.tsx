import type { FC } from 'react';
import { useState } from 'react';
import type { Category } from '../../types/Category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  category?: Category | null;
}

export const CategoryModal: FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit, category }) => {
  const [name, setName] = useState(category?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <h2>{category ? 'Edit Category' : 'Add Category'}</h2>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <button type="submit">{category ? 'Update' : 'Add'}</button>
        </form>
      </div>
    </div>
  );
};
