import type { FC } from 'react';
import { useState } from 'react';
import type { Entry } from '../../types/Entry';
import type { Category } from '../../types/Category';
import { EntryType } from '../../types/EntryType';
import { Modal } from '../common/Modal';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  entry?: Entry | null;
  categories: Category[];
}

export const EntryModal: FC<EntryModalProps> = ({ isOpen, onClose, onSubmit, entry, categories }) => {
  const [name, setName] = useState(entry?.name || '');
  const [description, setDescription] = useState(entry?.description || '');
  const [value, setValue] = useState(entry?.value || 0);
  const [type, setType] = useState<EntryType>(entry?.type || EntryType.INCOME);
  const [categoryId, setCategoryId] = useState<number | null>(entry?.category?.id.value || null);
  const [entryDate, setEntryDate] = useState(
    entry ? new Date(entry.entryDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.id.value === categoryId) || null;
    onSubmit({ name, description, value, type, category, entryDate });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={entry ? 'Edit Entry' : 'Add Entry'}>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Value:
          <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} required />
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(Number(e.target.value) as EntryType)}>
            <option value={EntryType.INCOME}>Income</option>
            <option value={EntryType.EXPENSE}>Expense</option>
          </select>
        </label>
        <label>
          Category:
          <select value={categoryId || ''} onChange={(e) => setCategoryId(Number(e.target.value))}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id.value} value={category.id.value}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Entry Date:
          <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
        </label>
        <button type="submit">{entry ? 'Update' : 'Add'}</button>
      </form>
    </Modal>
  );
};
