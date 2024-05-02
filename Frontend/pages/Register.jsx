import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';

export default function Register({onPress}) {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [id, onChangeId] = useState('');
    const [invalid, setInvalid] = useState('');

    const validateAndRegister = () => {
        // Valid Email
        if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
            setInvalid('email')
            return false;
        }
        // Password: >8, 1 uppercase, 1 lowercase, 1 number
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            setInvalid('password')
            return false;
        }
        // Id: 8 digits - 4 digits
        if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            setInvalid('id')
            return false;
        }
        onPress({email, password, id});
    }

    return (
        <View style={{ flex: 1 }}>
            <BackButton onPress={() => onPress('cancel')}/>
            <View style={styles.container}>
                <Text style={[styles.title, invalid==='email' && { color: 'red' }]}>Correo Electronico</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder="email@ejemplo.com"
                    keyboardType="email-address"
                />
                <Text style={[styles.title, invalid==='password' && { color: 'red' }]}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="••••••••••"
                    secureTextEntry={true}
                />
                <Text style={[styles.title, invalid==='id' && { color: 'red' }]}>Legajo</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeId}
                    value={id}
                    placeholder="12345678-4321"
                    keyboardType="numeric"
                />
                <MenuButton text="Registrar" onPress={validateAndRegister} style={{height: 75}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
        width: '100%',
        justifyContent: 'center',
        padding: 25,
    },
    title: {
        fontSize: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        alignSelf: 'flex-start',
        padding: 5,
        paddingHorizontal: 15,
        elevation: 2,
        borderBottomWidth: 1,
        borderColor: '#CCC',
    },
    input: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 25,
        borderTopLeftRadius: 0,
        fontSize: 20,
        marginBottom: 20,
        elevation: 2,
    },
});