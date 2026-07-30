import { useQuery } from "@tanstack/react-query";
import { expensesRepository } from "../api/expenses";

export function useExpenses(year: number, month: number) {
  return useQuery({
    queryKey: ["expenses", year, month],
    queryFn: () => expensesRepository.getByMonth(year, month),
    select: (data) => data.response,
    staleTime: 30_000,
    retry: false,
  });
}
