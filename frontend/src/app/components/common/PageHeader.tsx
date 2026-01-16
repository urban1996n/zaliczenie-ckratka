import type { FC, ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string | ReactNode;
  buttonText: string;
  onAddClick: () => void;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, buttonText, onAddClick }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl">{title}</h2>
      <button
        onClick={onAddClick}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        {buttonText}
      </button>
    </div>
  );
};
