import type { MonthlySummary } from '../types/MonthlySummary';
import type { HttpClient } from './httpClient.ts';

export const getMonthlySummary = async (
  httpClient: HttpClient,
  dateFrom: Date,
  dateTo: Date
): Promise<MonthlySummary> => {
  return httpClient.get<MonthlySummary>(
    `/Entries/summary?dateFrom=${encodeURIComponent(dateFrom.toISOString())}&dateTo=${encodeURIComponent(dateTo.toISOString())}`
  );
};
