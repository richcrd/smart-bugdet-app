import { useQuery } from "@tanstack/react-query";
import { catalogRepository } from "../data/catalog";

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog", "language"],
    queryFn: () => catalogRepository.languages(),
    select: (data) => data.response,
  });
}

export function useCurrencies() {
  return useQuery({
    queryKey: ["catalog", "currency"],
    queryFn: () => catalogRepository.currencies(),
    select: (data) => data.response,
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["catalog", "payment-methods"],
    queryFn: () => catalogRepository.paymentMethods(),
    select: (data) => data.response,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["catalog", "categories"],
    queryFn: () => catalogRepository.categories(),
    select: (data) => data.response,
  });
}
