import { http } from "@/src/shared/http/requests";

export type RegisterDeviceRequest = {
  expoPushToken: string;
  platform: string;
};

export const notificationsRepository = {
  registerDevice: (body: RegisterDeviceRequest) => {
    return http.post<null>("/service/notifications/register-device", body);
  },
};
