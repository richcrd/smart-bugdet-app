import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangePasswordRequest, UpdateProfileRequest, userProfileRepository } from "../data/userProfile";
import { queryClient } from "@/src/shared/http/queryClient";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => userProfileRepository.update(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: ChangePasswordRequest) => userProfileRepository.changePassword(body),
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userProfileRepository.get(),
    select: (data) => data.response,
  });
}
