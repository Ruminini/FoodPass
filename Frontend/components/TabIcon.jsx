import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default function TabIcon({ text, onPress, selected=false, svg, style }) {
    
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <View style={styles.icon}>
                <View style={{ aspectRatio: 1 }}>
                    {svg}
                </View>
            </View>
            {text && <Text style={[styles.text, { color: selected ? 'white' : 'black' }]}>{text}</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
		height: '100%',
        overflow: 'hidden',
        aspectRatio: 1,
        borderRadius: 10,
    },
    icon: {
        flex: 1,
        borderRadius: 15,
    },
    text: {
        fontSize: 12,
        fontWeight: '300',
        color: 'black',
        textAlign: 'center',
    },
});