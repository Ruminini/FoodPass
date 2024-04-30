import { StyleSheet, Text, ScrollView } from 'react-native'
import React from 'react'

export default function MenuList(props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {props.children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    contentContainer: {
      flexGrow: 1,
      padding: 25,
    }
})