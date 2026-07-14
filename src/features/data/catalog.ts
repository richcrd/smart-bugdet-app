import { http } from "@/src/shared/http/requests";

export type LanguageResponse = {
  id: number;
  code: string;
  name: string;
};

export type CurrencyResponse = {
  id: number;
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
}

export type PaymentMethodResponse = {
  id: number;
  name: string;
}

export type CategoryResponse = {
  id: number;
  name: string;
  icon: string;
  color: string;
  subcategories: SubcategoryResponse[]
}

export type SubcategoryResponse = {
  id: number;
  name: string;
  icon: string;
}

export const catalogRepository = {
  languages: () => {
    return http.get<LanguageResponse[]>("/service/catalog/language")
  },

  currencies: () => {
    return http.get<CurrencyResponse[]>("/service/catalog/currencies")
  },

  paymentMethods: () => {
    return http.get<PaymentMethodResponse[]>("/service/catalog/payment-methods")
  },

  categories: () => {
    return http.get<CategoryResponse[]>("/service/catalog/categories")
  }
}