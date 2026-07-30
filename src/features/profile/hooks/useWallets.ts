import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateWalletRequest, UpdateWalletRequest } from "@/src/features/profile/api/wallets";
import { walletsRepository } from "@/src/features/profile/api/wallets";
import { queryClient } from "@/src/shared/http/queryClient";

export function useWallets() {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: () => walletsRepository.list(),
    select: (data) => data.response,
  });
}

function invalidateWalletQueries() {
  queryClient.invalidateQueries({ queryKey: ["wallets"] });
  queryClient.invalidateQueries({ queryKey: ["summary"] });
  queryClient.invalidateQueries({ queryKey: ["transaction"] });
}

export function useCreateWallet() {
  return useMutation({
    mutationFn: (body: CreateWalletRequest) => walletsRepository.create(body),
    onSuccess: invalidateWalletQueries,
  });
}

export function useUpdateWallet() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateWalletRequest }) => {
      return walletsRepository.update(id, body)
    },
    onSuccess: invalidateWalletQueries,
  });
}

export function useSetDefaultWallet() {
  return useMutation({
    mutationFn: (id: number) => walletsRepository.setDefault(id),
    onSuccess: invalidateWalletQueries,
  });
}

export function useDeleteWallet() {
  return useMutation({
    mutationFn: (id: number) => walletsRepository.remove(id),
    onSuccess: invalidateWalletQueries,
  });
}
