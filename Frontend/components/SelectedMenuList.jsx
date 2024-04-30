import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'

export default function SelectedMenuList(props) {
  return (
    <ScrollView horizontal={true} style={styles.container} contentContainerStyle={styles.contentContainer}>
        {props.children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.3,
        backgroundColor: 'white',
        maxHeight: '30%',
    },
    contentContainer: {
      flexGrow: 1,
      padding: 25,
    }
})