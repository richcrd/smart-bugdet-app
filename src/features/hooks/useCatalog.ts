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
