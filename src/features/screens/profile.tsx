import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../stores/auth.store';
import { getErrorMessage } from '@/src/shared/utils/common';
import { useCatalog, useCurrencies } from '../hooks/useCatalog';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"

type SheetType = 'languages' | 'currencies' | null;

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const { data: languages, isLoading: isLanguageLoading } = useCatalog();
  const { data: currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenLanguages = () => {
    setSheetType('languages')
    bottomSheetRef.current?.expand();
  };

  const handleOpenCurrencies = () => {
    setSheetType('currencies')
    bottomSheetRef.current?.expand();
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const renderLanguageItem = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>
          {sheetType === 'languages'
          ? `${item.name} ${item.code}`
          : `${item.name} - ${item.symbol || ''}`
          }
        </Text>
      </View>
    )
  }, [sheetType]);

  const listData = sheetType === 'languages' ? languages : currencies;

  if (isLanguageLoading || isCurrenciesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenLanguages}
        style={styles.openButton}
      >
        <Text style={styles.openButtonText}>Idiomas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleOpenCurrencies}
        style={styles.openButton}
      >
        <Text style={styles.openButtonText}>Monedas</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={handleLogout} 
        disabled={loading} 
        style={styles.logoutButton}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={styles.logoutText}>Cerrar sesión</Text>
        }
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["50%"]}
        enablePanDownToClose={true}
        onClose={() => setSheetType(null)}
      >
        <BottomSheetFlatList
          data={listData || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderLanguageItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {sheetType === 'languages' ? 'No se encontraron idiomas' : 'No se encontraron monedas'}
            </Text>
          }
        />
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#d3d3d3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  openButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  itemContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#8e8e93'
  }
})