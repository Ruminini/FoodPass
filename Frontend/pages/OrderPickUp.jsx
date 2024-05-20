import React, { useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity  } from 'react-native';
import BackButton from '../components/BackButton';

export default function OrderPickUp({ data, goTo }) {
    const legajo = data.legajo
    //Lógica para mostrar el pedido y poder retirarlo
    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.text}>Hola {legajo}, este es tu pedido:</Text>
                <TouchableOpacity
                    style={[styles.largeBlueButton]}
                    //onPress={() => onPress('orderPickUp')}
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
        padding: 20,
        position: 'relative',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
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