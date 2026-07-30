import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useCreateTransaction, useDashboard } from "../home/hooks/useDashboard";
import { useWallets } from "../profile/hooks/useWallets";
import { styles } from "../../shared/styles/forms";
import { CategoryPickerSheet } from "@/src/shared/components/sheets/CategorySheetContent";
import { PaymentMethodPickerSheet } from "@/src/shared/components/sheets/PaymentMethodSheetContent";
import { TransactionTypeToggle } from "./components/TransactionTypeToggle";
import { TransactionDetailsCard } from "./components/TransactionDetailsCard";
import { formatPrettyDate, toLocalDateString } from "./components/types";
import type { SelectableItem, SheetType, TransactionType } from "./components/types";
import { toast } from "sonner-native";
import { DatePickerSheet } from "@/src/shared/components/sheets/DatePickerSheet";
import { getApiError } from "@/src/shared/utils/common";
import { useUserPaymentMethods, useUserCategories } from "../profile/hooks/useUserData";

const TRANSACTION_TYPE_IDS: Record<TransactionType, number> = {
  gasto: 1,
  ingreso: 2,
};

type Props = {
  onSave: () => void;
};

export function AddTransactionForm({ onSave }: Props) {
  const { data: summary } = useDashboard();
  const { data: wallets } = useWallets();
  const { data: paymentMethod } = useUserPaymentMethods();
  const { data: categories } = useUserCategories();
  const createTransaction = useCreateTransaction();
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [sheetSnapPoints, setSheetSnapPoints] = useState(["60%"]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [type, setType] = useState<TransactionType>("gasto");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectableItem | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SelectableItem | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectableItem | null>(null);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  const renderBackdrop = useCallback((props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ), []
  );

  const openSheet = (nextSheetType: SheetType) => {
    setSheetType(nextSheetType);
    setSheetSnapPoints(nextSheetType === "date" ? ["60%"] : ["50%"]);
    bottomSheetRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handleSelectCategory = (item: SelectableItem, subcategory?: SelectableItem | null) => {
    setSelectedCategory(item);
    setSelectedSubcategory(subcategory ?? null);
    closeSheet();
  };

  const handleSelectPaymentMethod = (item: SelectableItem) => {
    setSelectedPaymentMethod(item);
    closeSheet();
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        display: "calendar",
        maximumDate: new Date(),
        onChange: (event, selected) => {
          if (event.type === "set" && selected) {
            setDate(selected);
          }
        },
      });
      return;
    }

    openSheet("date");
  };

  const handleSave = () => {
    const wallet = wallets?.find((w) => w.isDefault) ?? wallets?.[0];
    const newAmount = parseFloat(amount.replace(",", "."));

    if (!wallet) {
      toast.info("No se encontró una billetera para registrar el movimiento.");
      return;
    }

    if (!newAmount || newAmount <= 0) {
      toast.warning("Ingresa un monto mayor a 0.");
      return;
    }

    if (!selectedCategory) {
      toast.warning("Selecciona una categoría.");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.warning("Selecciona un método de pago.");
      return;
    }

    createTransaction.mutate(
      {
        walletId: wallet.id,
        transactionTypeId: TRANSACTION_TYPE_IDS[type],
        categoryId: selectedCategory.id,
        subcategoryId: selectedSubcategory?.id ?? null,
        paymentMethodId: selectedPaymentMethod.paymentMethodId ?? selectedPaymentMethod.id,
        currencyId: wallet.currencyId,
        amount: newAmount,
        exchangeRate: null,
        description,
        transactionDate: toLocalDateString(date),
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onSave();
        },
        onError: (error) => {
          toast.error(getApiError(error).message);
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Nuevo movimiento</Text>

            <Text style={styles.subtitle}>Registra un gasto o ingreso</Text>
          </View>
        </View>

        <TransactionTypeToggle value={type} onChange={setType} />

        {/* Monto */}

        <View style={styles.amountCard}>
          <Text style={styles.currency}>{summary?.currencySymbol ?? "C$"}</Text>

          <BottomSheetTextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#CBD5E1"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <TransactionDetailsCard
          categoryName={selectedCategory?.name}
          subcategoryName={selectedSubcategory?.name}
          paymentMethodName={selectedPaymentMethod?.name}
          dateLabel={formatPrettyDate(date)}
          onPressCategory={() => openSheet("categories")}
          onPressPaymentMethod={() => openSheet("payment-methods")}
          onPressDate={handleOpenDatePicker}
        />

        {/* Descripcion */}

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Descripción</Text>

          <BottomSheetTextInput
            style={styles.descriptionInput}
            multiline
            numberOfLines={4}
            placeholder="Agregar una descripción..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Boton */}

        <TouchableOpacity
          style={[styles.saveButton, createTransaction.isPending && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={createTransaction.isPending}
        >
          <Text style={styles.saveButtonText}>
            {createTransaction.isPending ? "Guardando..." : "Guardar movimiento"}
          </Text>
        </TouchableOpacity>

        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={sheetSnapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          stackBehavior="push"
          onDismiss={() => setSheetType(null)}
          backdropComponent={renderBackdrop}
        >
          {sheetType === "date" ? (
            <DatePickerSheet
              value={date}
              onChange={setDate}
              onDone={closeSheet}
              title="Fecha"
              maximumDate={new Date()}
            />
          ) : sheetType === "categories" ? (
            <CategoryPickerSheet
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleSelectCategory}
            />
          ) : (
            <PaymentMethodPickerSheet
              paymentMethods={paymentMethod}
              selectedPaymentMethod={selectedPaymentMethod}
              onSelect={handleSelectPaymentMethod}
            />
          )}
        </BottomSheetModal>
      </BottomSheetScrollView>
    </KeyboardAvoidingView>
  );
}
