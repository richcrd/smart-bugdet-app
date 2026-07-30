import { http } from "@/src/shared/http/requests";

export type WalletResponse = {
  id: number;
  name: string;
  currencyId: number;
  currencyCode: string;
  currencySymbol: string;
  currentBalance: number;
  isDefault: boolean;
};

export type CreateWalletRequest = {
  name: string;
  currencyId: number;
};

export type UpdateWalletRequest = {
  name: string;
};

export const walletsRepository = {
  list: () => {
    return http.get<WalletResponse[]>("/service/wallet");
  },

  create: (body: CreateWalletRequest) => {
    return http.post<WalletResponse>("/service/wallet", body);
  },

  update: (id: number, body: UpdateWalletRequest) => {
    return http.put<WalletResponse>(`/service/wallet/${id}`, body);
  },

  setDefault: (id: number) => {
    return http.put<WalletResponse>(`/service/wallet/${id}/default`);
  },

  remove: (id: number) => {
    return http.delete<null>(`/service/wallet/${id}`);
  },
};
