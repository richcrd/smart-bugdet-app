import { useQuery } from "@tanstack/react-query";
import { analyticsRepository } from "../api/analytics";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => analyticsRepository.get(),
    select: (data) => data.response,
  });
}
