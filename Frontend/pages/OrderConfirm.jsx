import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import MenuList from '../components/MenuList'
import MenuButton from '../components/MenuButton'
import Toast from 'react-native-toast-message'
import BackButton from '../components/BackButton'
import FoodItem from '../components/FoodItem'

export default function OrderConfirm({ data, before, after }) {
    const foods = data.foods ||  []

    if (foods.length === 0) {
        before()
        Toast.show({ type: 'info', text1: 'Primero debes seleccionar algun plato' })
    }
    return (
        <View style={styles.container}>
            <View style={styles.title} >
                <Text style={styles.text}>Tu pedido:</Text>
            </View>
            <MenuList alignTop={true}>
                {foods.map((food, index) => (
                    <FoodItem
                    key={index}
                    title={food.title}
                    description={food.description} />
                ))}
            </MenuList>
            <MenuButton
                text='Confirmar'
                style={styles.button}
                onPress={after} />
            <BackButton onPress={before}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    title: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 10,
    },
    text: {
        fontSize: 40,
    },
    button: {
        height: 75,
        width: '80%',
        alignSelf: 'center',
    }
})
