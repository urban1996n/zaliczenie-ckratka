import type { MonthlySummary } from '../types/MonthlySummary';
import { httpClient } from './httpClient';

export const getMonthlySummary = async (year: number, month: number): Promise<MonthlySummary> => {
  return httpClient.get<MonthlySummary>(`/api/MonthlySummary?year=${year}&month=${month}`);
};
