import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useCreateTransaction, useDashboard } from "../hooks/useDashboard";
import { useWallets } from "../hooks/useWallets";
import { styles } from "../styles/AddTransactionStyles";
import { useCategories, usePaymentMethods } from "../hooks/useCatalog";
import { CategorySheetContent } from "./add-transaction/CategorySheetContent";
import { PaymentMethodSheetContent } from "./add-transaction/PaymentMethodSheetContent";
import { DateSheetContent } from "./add-transaction/DateSheetContent";
import { TransactionTypeToggle } from "./add-transaction/TransactionTypeToggle";
import { TransactionDetailsCard } from "./add-transaction/TransactionDetailsCard";
import { formatPrettyDate, toLocalDateString } from "./add-transaction/types";
import type { SelectableItem, SheetType, TransactionType } from "./add-transaction/types";
import { toast } from "sonner-native";

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
  const { data: paymentMethod } = usePaymentMethods();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [type, setType] = useState<TransactionType>("gasto");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectableItem | null>(null);
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
    bottomSheetRef.current?.present();
  };

  const closeSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handleSelectCategory = (item: SelectableItem) => {
    setSelectedCategory(item);
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
        subcategoryId: null,
        paymentMethodId: selectedPaymentMethod.id,
        currencyId: wallet.currencyId,
        amount: newAmount,
        exchangeRate: null,
        description,
        transactionDate: toLocalDateString(date),
      },
      {
        onSuccess: () => onSave(),
        onError: () => {
          Alert.alert("Error", "No se pudo guardar el movimiento. Intenta de nuevo.");
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

          <TextInput
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
          paymentMethodName={selectedPaymentMethod?.name}
          dateLabel={formatPrettyDate(date)}
          onPressCategory={() => openSheet("categories")}
          onPressPaymentMethod={() => openSheet("payment-methods")}
          onPressDate={handleOpenDatePicker}
        />

        {/* Descripcion */}

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Descripción</Text>

          <TextInput
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
          snapPoints={["60%"]}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          stackBehavior="push"
          onDismiss={() => setSheetType(null)}
          backdropComponent={renderBackdrop}
        >
          {sheetType === "date" ? (
            <DateSheetContent date={date} onChange={setDate} onDone={closeSheet} />
          ) : sheetType === "categories" ? (
            <CategorySheetContent
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleSelectCategory}
            />
          ) : (
            <PaymentMethodSheetContent
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
