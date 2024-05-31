import React, { useEffect, useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity  } from 'react-native';
import BackButton from '../components/BackButton';
import { getOrderFoodsByUserId, pickupOrder } from '../service_db/DBQuerys';
import MenuList from '../components/MenuList';
import FoodItem from '../components/FoodItem';
import Toast from 'react-native-toast-message';

export default function OrderPickUp({ data, goTo }) {
    const [order, setOrder] = useState(null);
    if (!data || !data.legajo) {
        setTimeout(() => goTo(
            'Login',
            {},
            () => goTo('MainMenu'),
            (id) => goTo('OrderPickUp', {legajo: id})
        ), 50);
        return <View/>;
    }
    const legajo = data.legajo;
    useEffect(() => {
        console.log('OrderPickUp: ' + legajo);
        getOrderFoodsByUserId(legajo)
            .then(setOrder)
            .catch((reason) => {
                reason == "No orders" &&
                Toast.show({ type: 'error', text1: 'No tienes ordenes para retirar', text2: 'Prueba realizar un pedido' })
                goTo('MainMenu');
            });
    }, []);
    //Lógica para mostrar el pedido y poder retirarlo
    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.text}>Hola {legajo},{'\n'} este es tu pedido:</Text>
                <MenuList alignTop={true}>
                    {order && order.map((food, index) => (
                        <FoodItem
                        key={index}
                        title={food.name}
                        description={food.description} />
                    ))}
                </MenuList>
                <TouchableOpacity
                    style={[styles.largeBlueButton]}
                    onPress={() => {
                        pickupOrder(legajo)
                        Toast.show({ type: 'success', text1: 'Pedido Retirado' })
                        goTo('MainMenu');
                    }}
                >
                    <Text style={styles.largeBlueButtonText}>Retirar Pedido</Text>
                </TouchableOpacity>
            </View>
            <BackButton onPress={() => goTo('MainMenu')}></BackButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        position: 'relative',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        width: '60%',
        textAlign: 'center',
    },
    largeBlueButton: {
        backgroundColor: '#0000FF',
        padding: 20,
        borderRadius: 15,
        marginTop: 30,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    largeBlueButtonText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});