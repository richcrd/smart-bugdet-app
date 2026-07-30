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
  userId: number;
  isSystem: boolean;
  transactionTypeId: number;
  subcategories: SubcategoryResponse[]
}


export type SubcategoryResponse = {
  id: number;
  name: string;
  icon: string;
  userId: number;
  isSystem: boolean;
}

export type UserPaymentMethodResponse = {
  id: number;
  paymentMethodId: number;
  name: string;
  alias: string | null;
}


export const catalogRepository = {
  languages: () => {
    return http.get<LanguageResponse[]>("/service/catalog/language")
  },

  currencies: () => {
    return http.get<CurrencyResponse[]>("/service/catalog/currencies")
  },

  systemPaymentMethods: () => {
    return http.get<PaymentMethodResponse[]>("/service/catalog/payment-methods")
  },
}