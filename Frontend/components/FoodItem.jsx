import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

export default function FoodItem({ title, description, stock, selected=false, onPress, imgPath, style }) {
    if(imgPath === null){
        imgPath = require("../assets/icon.png")
        return (
            <View style={[styles.container, style]}>
                <TouchableOpacity style={styles.image_holder} onPress={onPress}>
                    <Image source={imgPath} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.background,  selected && styles.selectedStyle]} onPress={onPress}>
                    <Text style={styles.title}>{title}</Text>
                    {description && <Text style={styles.description}>{description} {stock}</Text>}
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity style={styles.image_holder} onPress={onPress}>
                <Image source={{uri: imgPath}} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.background,  selected && styles.selectedStyle]} onPress={onPress}>
                <Text style={styles.title}>{title}</Text>
                {description && <Text style={styles.description}>{description} {stock}</Text>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        marginVertical: 15,
		width: '100%',
        minHeight: 150,

    },
    image_holder: {
        height: 150,
        width: 150,
        borderRadius: 75,
        position: 'absolute',
        zIndex: 1,
        elevation: 4,
        overflow: 'hidden',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    background: {
        flex: 1,
        marginLeft: 75,
        paddingLeft: 80,
        paddingRight: 10,
        paddingVertical: 10,
		width: '100%',
        left: 2,
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 25,
        height: 'auto',
    },
    selectedStyle: {
        borderWidth: 2,
        borderColor: 'green',
    },
    title: {
        fontSize: 24,
        fontWeight: '400',
        color: 'black',
        textAlign: 'justify',
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        color: 'black',
        textAlign: 'justify',
    },
})