import { useMutation } from "@tanstack/react-query";
import { RegisterRequest, authRepository } from "@/src/features/auth/api/auth";

export function useRegister() {
  return useMutation({ 
    mutationFn: (data: RegisterRequest) => authRepository.register(data),})
}
     