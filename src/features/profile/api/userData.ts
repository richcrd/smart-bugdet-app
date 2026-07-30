import { http } from "@/src/shared/http/requests";
import { CategoryResponse, SubcategoryResponse, UserPaymentMethodResponse } from "./catalog";

export type CreateCategoryRequest = {
  name: string;
  icon?: string;
  color?: string;
  transactionTypeId: number;
};

export type UpdateCategoryRequest = {
  name?: string;
  icon?: string;
  color?: string;
};

export type CreateSubcategoryRequest = {
  categoryId: number;
  name: string;
  icon?: string;
};

export type UpdateSubcategoryRequest = {
  name?: string;
  icon?: string;
};

export type LinkPaymentMethodRequest = {
  paymentMethodId: number;
  alias?: string;
};

export type UpdatePaymentMethodAliasRequest = {
  alias?: string;
};

export const userDataRepository = {
  categories: () => {
    return http.get<CategoryResponse[]>("/service/user/categories");
  },

  createCategory: (body: CreateCategoryRequest) => {
    return http.post<CategoryResponse>("/service/user/categories", body);
  },

  updateCategory: (id: number, body: UpdateCategoryRequest) => {
    return http.put<CategoryResponse>(`/service/user/categories/${id}`, body);
  },

  deleteCategory: (id: number) => {
    return http.delete<null>(`/service/user/categories/${id}`);
  },

  createSubcategory: (body: CreateSubcategoryRequest) => {
    return http.post<SubcategoryResponse>("/service/user/subcategories", body);
  },

  updateSubcategory: (id: number, body: UpdateSubcategoryRequest) => {
    return http.put<SubcategoryResponse>(`/service/user/subcategories/${id}`, body);
  },

  deleteSubcategory: (id: number) => {
    return http.delete<null>(`/service/user/subcategories/${id}`);
  },

  userPaymentMethods: () => {
    return http.get<UserPaymentMethodResponse[]>("/service/user/payment-methods");
  },

  linkPaymentMethod: (body: LinkPaymentMethodRequest) => {
    return http.post<UserPaymentMethodResponse>("/service/user/payment-methods", body);
  },

  updatePaymentMethodAlias: (id: number, body: UpdatePaymentMethodAliasRequest) => {
    return http.put<UserPaymentMethodResponse>(`/service/user/payment-methods/${id}`, body);
  },

  unlinkPaymentMethod: (id: number) => {
    return http.delete<null>(`/service/user/payment-methods/${id}`);
  },
};
