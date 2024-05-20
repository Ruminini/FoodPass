import { StyleSheet, View } from 'react-native'
import React from 'react'
import MenuButton from '../components/MenuButton'
import MenuList from '../components/MenuList'
import BackButton from '../components/BackButton'
import Food from '../assets/svg/food.svg'
import Register from '../assets/svg/register.svg'

export default function ConfigMenu({onPress}) {
    return (
        <View style={styles.container}>
            <BackButton onPress={() => onPress('cancel')}/>
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