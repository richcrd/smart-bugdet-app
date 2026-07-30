import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, TrendingDown, Wallet } from "lucide-react-native";
import { useExpenses } from "./hooks/useExpenses";
import { formatCurrency } from "@/src/shared/utils/common";
import { getIconByKey } from "@/src/shared/constants/iconCatalog";
import { getContrastColor } from "@/src/shared/constants/colors";
import type { TransactionList } from "@/src/features/home/api/dashboard";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${MONTHS[d.getMonth()].toLowerCase().slice(0, 3)}`;
}

function TransactionItem({ item }: { item: TransactionList }) {
  const Icon = getIconByKey(item.categoryIcon);
  return (
    <View className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 mb-3" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
      <View className="w-[42px] h-[42px] rounded-xl items-center justify-center mr-3.5" style={{ backgroundColor: item.categoryColor ?? "#F3F4F6" }}>
        <Icon size={18} color={getContrastColor(item.categoryColor ?? "#F3F4F6")} strokeWidth={1.8} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-[#0A0F1E]" numberOfLines={1}>
          {item.description || item.categoryName}
        </Text>
        <Text className="text-[12px] font-semibold text-[#6B7280] mt-0.5">
          {item.subcategoryName || item.categoryName}
          <Text className="text-[#9CA3AF] font-medium"> · {formatDate(item.transactionDate)}</Text>
        </Text>
      </View>
      <Text className="text-[15px] font-extrabold text-[#DC2626] ml-3">
        -{formatCurrency(item.amount, item.currencySymbol)}
      </Text>
    </View>
  );
}

export default function Expenses() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data, isLoading, isRefetching, refetch } = useExpenses(year, month);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  const minDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const currentDate = new Date(year, month - 1, 1);
  const isMinMonth = currentDate <= minDate;

  const goPrev = () => {
    if (isMinMonth) return;
    if (month === 1) { setYear(year - 1); setMonth(12); }
    else setMonth(month - 1);
  };

  const goNext = () => {
    if (!isCurrentMonth) {
      if (month === 12) { setYear(year + 1); setMonth(1); }
      else setMonth(month + 1);
    }
  };

  const transactions = data?.transactions ?? [];
  const totalExpenses = data?.totalExpenses ?? 0;
  const symbol = data?.currencySymbol ?? "C$";

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F2F3F7]">
        <ActivityIndicator size="large" color="#1A9B5A" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3F7]" edges={["top", "left", "right"]}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="px-5 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={goPrev} disabled={isMinMonth} className="w-10 h-10 rounded-xl bg-white items-center justify-center" style={[{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }, isMinMonth && { opacity: 0.4 }]}>
                <ChevronLeft size={20} color="#0A0F1E" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text className="text-[18px] font-bold text-[#0A0F1E]">{MONTHS[month - 1]} {year}</Text>
              <TouchableOpacity
                onPress={goNext}
                disabled={isCurrentMonth}
                className="w-10 h-10 rounded-xl bg-white items-center justify-center"
                style={[{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }, isCurrentMonth && { opacity: 0.4 }]}
              >
                <ChevronRight size={20} color="#0A0F1E" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <View className="bg-white rounded-3xl p-5 mb-5 overflow-hidden" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-11 h-11 rounded-xl bg-[#FEE2E2] items-center justify-center">
                    <TrendingDown size={22} color="#DC2626" strokeWidth={2.5} />
                  </View>
                  <View>
                    <Text className="text-[12px] font-semibold text-[#6B7280]">Gastos del mes</Text>
                    <Text
                      className="text-[22px] font-extrabold text-[#DC2626]"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.6}
                    >
                      {formatCurrency(totalExpenses, symbol)}
                    </Text>
                  </View>
                </View>
                <View className="bg-[#FEE2E2] px-3 py-1.5 rounded-full">
                  <Text className="text-[11px] font-bold text-[#DC2626]">{transactions.length} transacciones</Text>
                </View>
              </View>
            </View>
            {transactions.length > 0 && (
              <Text className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-[1px] mb-3 px-0.5">
                Transacciones
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center mt-16">
            <View className="w-16 h-16 rounded-2xl bg-white items-center justify-center mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Wallet size={28} color="#9CA3AF" strokeWidth={1.5} />
            </View>
            <Text className="text-[18px] font-bold text-[#0A0F1E] mb-2">Sin gastos</Text>
            <Text className="text-[14px] font-medium text-[#6B7280] text-center leading-5 max-w-[220px]">
              No hay gastos registrados en {MONTHS[month - 1].toLowerCase()}.
            </Text>
          </View>
        }
        renderItem={TransactionItem}
      />
    </SafeAreaView>
  );
}
