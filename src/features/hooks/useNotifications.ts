import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationsRepository } from "@/src/features/data/notifications";
import { queryClient } from "@/src/shared/http/queryClient";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsRepository.list(),
    select: (data) => data.response,
  });
}

function invalidateNotificationQueries() {
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
}

export function useMarkNotificationRead() {
  return useMutation({
    mutationFn: (id: number) => notificationsRepository.markAsRead(id),
    onSuccess: invalidateNotificationQueries,
  });
}

export function useMarkAllNotificationsRead() {
  return useMutation({
    mutationFn: () => notificationsRepository.markAllAsRead(),
    onSuccess: invalidateNotificationQueries,
  });
}
