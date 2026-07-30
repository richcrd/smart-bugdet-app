import { ActivityIndicator, RefreshControl, ScrollView, Text, View, Dimensions } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-gifted-charts";
import { useAnalytics } from "./hooks/useAnalytics";
import { formatCurrency } from "@/src/shared/utils/common";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react-native";
import type { MonthlyTrendItem } from "./api/analytics";

const MONTH_LABELS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

const screenWidth = Dimensions.get("window").width;
const CHART_WIDTH = screenWidth - 72;

export default function Analytics() {
  const { data, isLoading, refetch, isRefetching } = useAnalytics();

  const chartData = useMemo(() => {
    return (data?.monthlyTrend ?? []).map((m: MonthlyTrendItem) => ({
      value: m.expenses,
      label: MONTH_LABELS[m.month - 1] ?? `${m.month}`,
    }));
  }, [data?.monthlyTrend]);

  const hasData = chartData.some((d) => d.value > 0);

  const totalExpense = data?.totalExpenseMonth ?? 0;
  const totalIncome = data?.totalIncomeMonth ?? 0;
  const available = data?.currentBalance ?? 0;
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
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#1A9B5A"
          />
        }
      >
        <View className="mb-6">
          <Text className="text-[30px] font-extrabold text-[#0A0F1E] mt-1.5">
            Análisis Mensual
          </Text>
        </View>

        <View className="flex-row gap-3 mb-3">
          <View
            className="flex-1 bg-white rounded-3xl p-5 min-h-[160px] justify-between overflow-hidden"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
          >
            <View>
              <View className="w-10 h-10 rounded-xl bg-[#FEE2E2] items-center justify-center mb-3">
                <TrendingDown size={20} color="#DC2626" strokeWidth={2.5} />
              </View>
              <Text className="text-[13px] font-semibold text-[#6B7280]">Gastos</Text>
            </View>
            <View>
              <Text
                className="text-[24px] font-extrabold text-[#0A0F1E]"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {formatCurrency(totalExpense, symbol)}
              </Text>
              <View className="flex-row items-center mt-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-1.5" />
                <Text className="text-[11px] font-bold text-[#9CA3AF]">Este mes</Text>
              </View>
            </View>
          </View>
          <View
            className="flex-1 bg-white rounded-3xl p-5 min-h-[160px] justify-between overflow-hidden"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
          >
            <View>
              <View className="w-10 h-10 rounded-xl bg-[#DCFCE7] items-center justify-center mb-3">
                <TrendingUp size={20} color="#16A34A" strokeWidth={2.5} />
              </View>
              <Text className="text-[13px] font-semibold text-[#6B7280]">Ingresos</Text>
            </View>
            <View>
              <Text
                className="text-[24px] font-extrabold text-[#0A0F1E]"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
              >
                {formatCurrency(totalIncome, symbol)}
              </Text>
              <View className="flex-row items-center mt-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-1.5" />
                <Text className="text-[11px] font-bold text-[#9CA3AF]">Este mes</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          className="bg-white rounded-3xl p-5 min-h-[100px] justify-between overflow-hidden mb-6"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-xl bg-[#E8F8F0] items-center justify-center">
                <Wallet size={20} color="#1A9B5A" strokeWidth={2.5} />
              </View>
              <View>
                <Text className="text-[15px] font-bold text-[#0A0F1E]">Disponible</Text>
                <View className="flex-row items-center mt-0.5">
                  <View className="w-1.5 h-1.5 rounded-full bg-[#1A9B5A] mr-1.5" />
                  <Text className="text-[11px] font-bold text-[#9CA3AF]">Saldo actual</Text>
                </View>
              </View>
            </View>
            <Text
              className="text-[26px] font-extrabold text-[#1A9B5A] text-right flex-shrink ml-4"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {formatCurrency(available, symbol)}
            </Text>
          </View>
        </View>

        <View
          className="bg-white rounded-3xl p-5 mb-6"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}
        >
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-[17px] font-bold text-[#0A0F1E]">Tendencia de Gastos</Text>
              <Text className="text-[13px] font-semibold text-[#6B7280] mt-0.5">Últimos 6 meses</Text>
            </View>
            {hasData && (
              <View className="bg-[#E8F8F0] px-3.5 py-1.5 rounded-full">
                <Text className="text-[12px] font-bold text-[#1A9B5A]">
                  Total {formatCurrency(chartData.reduce((a, b) => a + b.value, 0), symbol)}
                </Text>
              </View>
            )}
          </View>

          <LineChart
            data={chartData}
            width={CHART_WIDTH}
            height={180}
            areaChart
            color="#1A9B5A"
            thickness={3}
            startFillColor="#1A9B5A"
            endFillColor="#1A9B5A"
            startOpacity={0.12}
            endOpacity={0.01}
            dataPointsColor="#1A9B5A"
            dataPointsRadius={4}
            initialSpacing={20}
            endSpacing={20}
            hideYAxisText
            yAxisColor="transparent"
            xAxisColor="#E5E7EB"
            xAxisThickness={1}
            showVerticalLines={false}
            noOfSections={3}
            rulesColor="#E5E7EB"
            rulesThickness={1}
            xAxisLabelTextStyle={{
              color: "#9CA3AF",
              fontSize: 11,
              fontWeight: "600",
            }}
            scrollToEnd={false}
            isAnimated
          />

        </View>

        {!hasData && (
          <View
            className="bg-white rounded-3xl p-8 items-center"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View className="w-14 h-14 rounded-2xl bg-[#F2F3F7] items-center justify-center mb-4">
              <TrendingDown size={24} color="#9CA3AF" strokeWidth={1.5} />
            </View>
            <Text className="text-[17px] font-bold text-[#0A0F1E] mb-2">Sin datos de gastos</Text>
            <Text className="text-[14px] font-medium text-[#6B7280] text-center leading-6">
              Registra transacciones para visualizar{"\n"}el análisis y la tendencia de tus gastos.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
