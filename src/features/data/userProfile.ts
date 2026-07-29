import { http } from "@/src/shared/http/requests";

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
};

export type ChangePasswordRequest = {
  currentPassowrd: string;
  newPassword: string;
};

export type UserProfileResponse = {
  peopleId: number;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  userName: string;
  email: string;
  phoneNumber: string | null;
};

export const userProfileRepository = {
  get: () => {
    return http.get<UserProfileResponse>("/service/user/profile");
  },

  update: (body: UpdateProfileRequest) => {
    return http.patch<null>("/service/user/profile", body);
  },

  changePassword: (body: ChangePasswordRequest) => {
    return http.post<null>("/service/user/change-password", body);
  },
}