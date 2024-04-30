import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MenuButton from '../components/MenuButton'
import MenuList from '../components/MenuList'
import Food from '../assets/svg/food.svg'
import Face from '../assets/svg/face-scan.svg'
import Register from '../assets/svg/register.svg'

export default function MainMenu() {
    return (
        <MenuList>
            <MenuButton
                svg={<Food/>}
                text='Elegir Menú'
                onPress={() => console.log('Elegir Menú')} />
            <MenuButton
                svg={<Face/>}
                text='Validar Usuario'
                onPress={() => console.log('Validar Usuario')} />
            <MenuButton
                svg={<Register/>}
                text='Registrar Usuario'
                onPress={() => console.log('Registrar Usuario')} />
        </MenuList>
    )
}