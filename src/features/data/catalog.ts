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

export const catalogRepository = {
  languages: () => {
    return http.get<LanguageResponse[]>("/service/catalog/language")
  },

  currencies: () => {
    return http.get<CurrencyResponse[]>("/service/catalog/currencies")
  },
}