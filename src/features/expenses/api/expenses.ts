import { http } from "@/src/shared/http/requests";
import type { TransactionList } from "@/src/features/home/api/dashboard";

export type ExpensesResponse = {
  totalExpenses: number;
  currencySymbol: string;
  transactions: TransactionList[];
};

export const expensesRepository = {
  getByMonth: (year: number, month: number) => {
    return http.get<ExpensesResponse>(`/service/expenses?year=${year}&month=${month}`);
  },
};
