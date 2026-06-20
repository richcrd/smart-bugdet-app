import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const expenses = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>expenses</Text>
    </SafeAreaView>
  )
}

export default expenses

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})