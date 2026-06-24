import { useMutation } from "@tanstack/react-query";
import { RegisterRequest, authRepository } from "@/src/features/data/auth";

export function useRegister() {
  return useMutation({ 
    mutationFn: (data: RegisterRequest) => authRepository.register(data),})
}
     