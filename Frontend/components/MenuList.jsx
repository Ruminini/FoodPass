import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'

export default function MenuList(props) {
  alignTop = !props.alignTop && {justifyContent: 'center'}
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, alignTop]}>
        {props.children}
    </ScrollView>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
        width: '100%',
    },
    contentContainer: {
      flexGrow: 1,
      padding: 25,
    }
})