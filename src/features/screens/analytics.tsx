import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const analytics = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>analytics</Text>
    </SafeAreaView>
  )
}

export default analytics

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})