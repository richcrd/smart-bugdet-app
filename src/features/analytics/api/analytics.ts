import { http } from "@/src/shared/http/requests";

export type MonthlyTrendItem = {
  year: number;
  month: number;
  expenses: number;
  incomes: number;
};

export type AnalyticsResponse = {
  currentBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  currencyCode: string;
  currencySymbol: string;
  monthlyTrend: MonthlyTrendItem[];
};

export const analyticsRepository = {
  get: () => {
    return http.get<AnalyticsResponse>("/service/analytics");
  },
};
