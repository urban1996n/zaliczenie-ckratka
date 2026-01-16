import type { MonthlySummary } from '../types/MonthlySummary';
import { httpClient } from './httpClient';

export const getMonthlySummary = async (dateFrom: Date, dateTo: Date): Promise<MonthlySummary> => {
  return httpClient.get<MonthlySummary>(
    `/Entries/summary?dateFrom=${encodeURIComponent(dateFrom.toISOString())}&dateTo=${encodeURIComponent(dateTo.toISOString())}`
  );
};
