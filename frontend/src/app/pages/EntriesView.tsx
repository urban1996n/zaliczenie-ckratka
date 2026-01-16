import type { FC } from 'react';
import type { Entry } from 'types/Entry';
import type { Category } from 'types/Category';
import { EntryType } from 'types/EntryType';
import { EntryModal } from 'app/components/EntryModal';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { LoadingErrorWrapper } from 'app/components/common/LoadingErrorWrapper';
import { PageHeader } from 'app/components/common/PageHeader';

interface EntriesViewProps {
  entries: Entry[];
  loading: boolean;
  error: Error | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDelete: (id: number) => void;
  currentDate: Date;
  onOpenModal: (entry?: Entry) => void;
  onCloseModal: () => void;
  onSubmit: (entryData: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isModalOpen: boolean;
  selectedEntry: Entry | null;
  categories: Category[];
}

export const EntriesView: FC<EntriesViewProps> = ({
  entries,
  loading,
  error,
  onPrevMonth,
  onNextMonth,
  onDelete,
  currentDate,
  onOpenModal,
  onCloseModal,
  onSubmit,
  isModalOpen,
  selectedEntry,
  categories,
}) => {
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <LoadingErrorWrapper loading={loading} error={error}>
      <div className="space-y-6">
        <PageHeader
          title={`Entries for ${monthName}`}
          buttonText="Add Entry"
          onAddClick={() => onOpenModal()}
        />

        <div className="flex items-center space-x-4">
          <button
            onClick={onPrevMonth}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous Month
          </button>
          <button
            onClick={onNextMonth}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Next Month
            <ChevronRight className="w-5 h-5 ml-2" />
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No entries for this month. Click "Add Entry" to create one.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id.value} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{entry.name}</td>
                      <td className="px-6 py-4 text-gray-600">{entry.description}</td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap ${
                          entry.type === EntryType.INCOME ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {entry.type === EntryType.INCOME ? '+' : '-'}$
                        {Math.abs(entry.value).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            entry.type === EntryType.INCOME
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {entry.type === EntryType.INCOME ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onOpenModal(entry)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(entry.id.value)}
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

        <EntryModal
          isOpen={isModalOpen}
          onClose={onCloseModal}
          onSubmit={onSubmit}
          entry={selectedEntry}
          categories={categories}
        />
      </div>
    </LoadingErrorWrapper>
  );
};
