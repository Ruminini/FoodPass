import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MenuButton from '../components/MenuButton'
import MenuList from '../components/MenuList'
import Food from '../assets/svg/food.svg'
import Face from '../assets/svg/face-scan.svg'
import Register from '../assets/svg/register.svg'
import Options from '../assets/svg/options.svg'
import SettingsButton from '../components/SettingsButton'

export default function MainMenu({onPress}) {
    return (
        <View style={{flex: 1}}>
            <SettingsButton onPress={() => onPress('ConfigMenu')}/>
            <MenuList>
                <MenuButton
                    svg={<Food/>}
                    text='Realizar pedido'
                    onPress={() => onPress('FoodPicker')} />
                <MenuButton
                    svg={<Face/>}
                    text='Retirar pedido'
                    onPress={() => onPress('FaceScan')} />
                <MenuButton
                    svg={<Register/>}
                    text='Registro'
                    onPress={() => onPress('Register')} />
                <MenuButton
                    svg={<Options/>}
                    text='Opciones'
                    onPress={() => onPress('Options')} />
            </MenuList>
        </View>
    )
}