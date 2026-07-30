import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateCategoryRequest, CreateSubcategoryRequest, LinkPaymentMethodRequest, UpdateCategoryRequest, UpdatePaymentMethodAliasRequest, UpdateSubcategoryRequest, userDataRepository } from "../data/userData";
import { queryClient } from "@/src/shared/http/queryClient";
import { catalogRepository } from "../data/catalog";

export function useUserCategories() {
  return useQuery({
    queryKey: ["user-categories"],
    queryFn: () => userDataRepository.categories(),
    select: (data) => data.response,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => userDataRepository.createCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCategoryRequest }) =>
      userDataRepository.updateCategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (id: number) => userDataRepository.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
}

export function useCreateSubcategory() {
  return useMutation({
    mutationFn: (body: CreateSubcategoryRequest) => userDataRepository.createSubcategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
}

export function useUpdateSubcategory() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateSubcategoryRequest }) =>
      userDataRepository.updateSubcategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
}

export function useDeleteSubcategory() {
  return useMutation({
    mutationFn: (id: number) => userDataRepository.deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
}

export function useUserPaymentMethods() {
  return useQuery({
    queryKey: ["user-payment-methods"],
    queryFn: () => userDataRepository.userPaymentMethods(),
    select: (data) => data.response,
  });
}

export function useSystemPaymentMethods() {
  return useQuery({
    queryKey: ["system-payment-methods"],
    queryFn: () => catalogRepository.systemPaymentMethods(),
    select: (data) => data.response,
  });
}

export function useLinkPaymentMethod() {
  return useMutation({
    mutationFn: (body: LinkPaymentMethodRequest) => userDataRepository.linkPaymentMethod(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-payment-methods"] });
    },
  });
}

export function useUpdatePaymentMethodAlias() {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdatePaymentMethodAliasRequest }) =>
      userDataRepository.updatePaymentMethodAlias(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-payment-methods"] });
    },
  });
}

export function useUnlinkPaymentMethod() {
  return useMutation({
    mutationFn: (id: number) => userDataRepository.unlinkPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-payment-methods"] });
    },
  });
}
