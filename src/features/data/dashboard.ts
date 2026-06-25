import { http } from "@/src/shared/http/requests";

export type SummaryResponse = {
  currentBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
};

export type TransactionList = {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  transactionTypeCode: string;
  transactionTypeName: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

export const dashboardRepository = {
  summary: () => {
    return http.get<SummaryResponse>("/service/summary")
  },

  transactionsList: () => {
    return http.get<TransactionList[]>("/service/transaction")
  },
}
