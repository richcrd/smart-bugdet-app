import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateTransactionRequest } from "../data/dashboard";
import { dashboardRepository } from "../data/dashboard";
import { queryClient } from "@/src/shared/http/queryClient";

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
    staleTime: 30_000,
    retry: false,
  });
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: (body: CreateTransactionRequest) => dashboardRepository.createTransaction(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
    },
  });
}