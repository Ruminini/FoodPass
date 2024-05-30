import { StyleSheet, View } from 'react-native'
import React from 'react'
import MenuButton from '../components/MenuButton'
import MenuList from '../components/MenuList'
import BackButton from '../components/BackButton'
import Food from '../assets/svg/food.svg'
import Register from '../assets/svg/register.svg'


export default function Admin({goTo}) {
    return (
        <View style={styles.container}>
            <MenuList >
            <MenuButton
                    svg={<Register/>}
                    text='Gestionar miembros/invitados'
                    onPress={() => goTo('ManageMembersGuests')} />
                <MenuButton
                    svg={<Food/>}
                    text='Gestionar menús'
                    onPress={() => goTo('ManageMenus')} />
            </MenuList>
            <BackButton onPress={() => goTo('MainMenu')}/>
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