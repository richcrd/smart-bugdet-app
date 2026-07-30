import { http } from "@/src/shared/http/requests";

export type SummaryResponse = {
  currentBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  currencyCode: string;
  currencySymbol: string;
};

export type TransactionList = {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  transactionTypeCode: string;
  transactionTypeName: string;
  categoryName: string;
  subcategoryName: string | null;
  categoryIcon: string;
  categoryColor: string;
  currencyCode: string;
  currencySymbol: string;
}

export type CreateTransactionRequest = {
  walletId: number;
  transactionTypeId: number;
  categoryId: number;
  subcategoryId: number | null;
  paymentMethodId: number;
  currencyId: number;
  amount: number;
  exchangeRate: number | null;
  description: string;
  transactionDate: string;
};

export const dashboardRepository = {
  summary: () => {
    return http.get<SummaryResponse>("/service/summary")
  },

  transactionsList: () => {
    return http.get<TransactionList[]>("/service/transaction")
  },

  createTransaction: (body: CreateTransactionRequest) => {
    return http.post<TransactionList>("/service/transaction", body)
  },
}
