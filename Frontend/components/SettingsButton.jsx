import { TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Settings from '../assets/svg/setting.svg'

export default function SettingsButton({ onPress, style}) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Settings width={50} height={50}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginHorizontal: 10,
        marginVertical: 5,
        position: 'absolute',
        right: 0
    }
})