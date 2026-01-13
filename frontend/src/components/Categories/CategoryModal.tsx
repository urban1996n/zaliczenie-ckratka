import type { FC } from 'react';
import { useState } from 'react';
import type { Category } from '../../types/Category';
import { Modal } from '../common/Modal';

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <button type="submit">{category ? 'Update' : 'Add'}</button>
      </form>
    </Modal>
  );
};
