import { useQuery } from "@tanstack/react-query";
import { dashboardRepository } from "../data/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["summary"],
    queryFn: () => dashboardRepository.summary(),
    select: (data) => data.response,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transaction"],
    queryFn: () => dashboardRepository.transactionsList(),
    select: (data) => data.response,
    refetchOnMount: true,
  });
}