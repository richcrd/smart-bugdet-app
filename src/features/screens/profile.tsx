import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../stores/auth.store';
import { getErrorMessage } from '@/src/shared/utils/common';

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

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

  return (
    <SafeAreaView style={styles.container}>
      <Text>Pantalla de Perfil</Text>
      <TouchableOpacity onPress={handleLogout} disabled={loading} style={styles.logoutButton}>
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Text style={styles.logoutText}>Cerrar sesión</Text>
        }
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
})