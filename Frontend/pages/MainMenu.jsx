import { View } from 'react-native'
import React from 'react'
import MenuButton from '../components/MenuButton'
import MenuList from '../components/MenuList'
import Food from '../assets/svg/food.svg'
import Face from '../assets/svg/face-scan.svg'
import Register from '../assets/svg/register.svg'
import Options from '../assets/svg/options.svg'
import SettingsButton from '../components/SettingsButton'
import Toast from 'react-native-toast-message';

export default function MainMenu({goTo}) {

    const showAdminToast = () => {
        Toast.show({ 
            type: 'info', 
            text1: 'Solo los administradores pueden realizar acciones.',
            visibilityTime: 3000, // Tiempo en milisegundos que se muestra el Toast
            autoHide: true, // Auto ocultar el Toast después de visibilityTime
        });
    };

    return (
        <View style={{flex: 1}}>
            <MenuList>
                <MenuButton
                    svg={<Food/>}
                    text='Realizar pedido'
                    onPress={() => goTo('FoodPicker')} />
                <MenuButton
                    svg={<Face/>}
                    text='Retirar pedido'
                    onPress={() => goTo('OrderPickUp')} />
                <MenuButton
                    svg={<Register/>}
                    text='Registro'
                    onPress={() => goTo('Register')} />
                <MenuButton
                    svg={<Options/>}
                    text='Opciones'
                    onPress={() => goTo('Options')} />
            </MenuList>
            <SettingsButton onPress={() => {
                showAdminToast();
                goTo('Admin');
            }}/>
        </View>
    )
}
