import { http } from "@/src/shared/http/requests";

export type RegisterDeviceRequest = {
  expoPushToken: string;
  platform: string;
};

export type NotificationResponse = {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export const notificationsRepository = {
  registerDevice: (body: RegisterDeviceRequest) => {
    return http.post<null>("/service/notifications/register-device", body);
  },

  list: () => {
    return http.get<NotificationResponse[]>("/service/notifications");
  },

  markAsRead: (id: number) => {
    return http.put<null>(`/service/notifications/${id}/read`);
  },

  markAllAsRead: () => {
    return http.put<null>("/service/notifications/read-all");
  },
};
