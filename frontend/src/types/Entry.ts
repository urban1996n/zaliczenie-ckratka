import type { Category } from './Category';
import { EntryType } from './EntryType';

export interface Entry {
  id: {
    value: number;
  };
  name: string;
  description: string;
  value: number;
  type: EntryType;
  category: Category | null;
  entryDate: string;
  createdAt: string;
  updatedAt: string | null;
}
