import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MenuButton from '../components/MenuButton'
import MenuList from '../components/MenuList'
import BackButton from '../components/BackButton'
import Food from '../assets/svg/food.svg'
import Register from '../assets/svg/register.svg'
import Constants from 'expo-constants';

export default function ConfigMenu() {
    return (
        <View style={styles.container}>
            <BackButton onPress={() => console.log('Volver')}/>
            <MenuList >
                <MenuButton
                    svg={<Food/>}
                    text='Gestionar Menúes'
                    onPress={() => console.log('Gestionar Menúes')} />
                <MenuButton
                    svg={<Register/>}
                    text='Gestionar Usuarios'
                    onPress={() => console.log('Gestionar Usuario')} />
            </MenuList>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
        width: '100%',
    }
})