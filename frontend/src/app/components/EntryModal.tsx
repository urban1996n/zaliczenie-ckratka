import type { FC, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import type { Entry } from 'types/Entry';
import type { Category } from 'types/Category';
import { EntryType } from 'types/EntryType';
import { X } from 'lucide-react';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  entry?: Entry | null;
  categories: Category[];
}

export const EntryModal: FC<EntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entry,
  categories,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [type, setType] = useState<EntryType>(EntryType.INCOME);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [entryDate, setEntryDate] = useState('');

  useEffect(() => {
    if (entry) {
      setName(entry.name);
      setDescription(entry.description);
      setValue(Math.abs(entry.value));
      setType(entry.type);
      setCategoryId(entry.category?.id.value || null);
      setEntryDate(new Date(entry.entryDate).toISOString().split('T')[0]);
    } else {
      setName('');
      setDescription('');
      setValue(0);
      setType(EntryType.INCOME);
      setCategoryId(null);
      setEntryDate(new Date().toISOString().split('T')[0]);
    }
  }, [entry]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const category = categories.find((c) => c.id.value === categoryId) || null;
    const finalValue = type === EntryType.INCOME ? value : -value;

    onSubmit({
      name,
      description,
      value: finalValue,
      type,
      category,
      entryDate,
    });

    console.log({ entryDate });
    setName('');
    setDescription('');
    setValue(0);
    setType(EntryType.INCOME);
    setCategoryId(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="bg-gray-500 bg-opacity-75" onClick={onClose} />

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl">{entry ? 'Edit Entry' : 'Add Entry'}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="entry-name" className="block text-sm mb-2 text-gray-700">
                  Name
                </label>
                <input
                  id="entry-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter entry name"
                />
              </div>

              <div>
                <label htmlFor="entry-description" className="block text-sm mb-2 text-gray-700">
                  Description
                </label>
                <input
                  id="entry-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div>
                <label htmlFor="entry-value" className="block text-sm mb-2 text-gray-700">
                  Value
                </label>
                <input
                  id="entry-value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="entry-type" className="block text-sm mb-2 text-gray-700">
                  Type
                </label>
                <select
                  id="entry-type"
                  value={type}
                  onChange={(e) => setType(Number(e.target.value) as EntryType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value={EntryType.INCOME}>Income</option>
                  <option value={EntryType.EXPENSE}>Expense</option>
                </select>
              </div>

              <div>
                <label htmlFor="entry-category" className="block text-sm mb-2 text-gray-700">
                  Category
                </label>
                <select
                  id="entry-category"
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(Number(e.target.value) || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id.value} value={category.id.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="entry-date" className="block text-sm mb-2 text-gray-700">
                  Entry Date
                </label>
                <input
                  id="entry-date"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  onBlur={(e) => setEntryDate(e.target.value)}
                  onInput={(e) => setEntryDate(e?.target?.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {entry ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
