import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

export default function SelectedFoodItem({ title, description, selected=false, onPress, imgPath=require('../assets/icon.png'), style }) {
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity style={styles.image_holder} onPress={onPress}>
                <Image source={imgPath} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.background} onPress={onPress}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 15,
		height: '100%',
        width: 150,
        justifyContent: 'flex-end',
    },
    image_holder: {
        height: '55%',
        aspectRatio: 1,
        zIndex: 1,
        borderRadius: 75,
        position: 'absolute',
        elevation: 2,
        overflow: 'hidden',
        top: 0
    },
    image: {
        height: '100%',
        width: '100%',
    },
    background: {
        flex: 0.75,
        padding: 10,
		height: '100%',
        backgroundColor: 'white',
        elevation: 4,
        borderRadius: 25,
        width: 150,
        justifyContent: 'flex-end',
    },
    title: {
        height: '55%',
        fontSize: 16,
        fontWeight: '300',
        color: 'black',
        textAlign: 'center',
    }
})