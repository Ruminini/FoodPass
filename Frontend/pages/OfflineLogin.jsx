import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import { validateId, validatePassword, userStateValidator} from '../services/LoginValidator';
//import {createLoginLog} from '../services/LogCreator'

export default function OfflineLogin({onPress}) {
    const [password, onChangePassword] = useState('');
    const [id, onChangeId] = useState('');
    const [invalid, setInvalid] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateAndLogIn = async () => {
        
        // Validación del formato del legajo
        if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            setErrorMessage('')
            setInvalid('id')
            return false;
        }
        // Validación del legajo con los legajos de usuarios registrados en la base de datos
        try {
            const idIsValid = await validateId(id);
            if (!idIsValid) {
                setErrorMessage('No es un legajo registrado.');
                resetForm();
                return false;
            }
        } catch (error) {
            console.error('Error al validar el legajo:', error);
            return false;
        }

        // Validación de la contraseña en la base de datos
        try {
            const passwordIsValid = await validatePassword(id, password);
            if (!passwordIsValid) {
                setErrorMessage('La contraseña es incorrecta.');
                resetForm();
                return false;
            }
        } catch (error) {
            console.error('Error al validar la contraseña:', error);
            return false;
        }

        //Validación del estado del usuario
        try {
            const userState = await userStateValidator(id);
            
            if(!userState){
                setErrorMessage('El usuario está dado de baja. Vuelva a registrarse');
                resetForm();
                return false;
            }
        } catch (error) {
            console.error('Error al validar el estado del usuario:', error);
            return false;
        }
        onPress({ user_id: id, page: 'orderPickUp' }),
        console.log('Usuario logueado')       
    }

    return (
        <View style={{ flex: 1 }}>
            <BackButton onPress={() => onPress('cancel')}/>
            <View style={styles.container}>
                <Text style={[styles.title, invalid==='id' && { color: 'red' }]}>Legajo</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeId}
                    value={id}
                    placeholder="12345678-4321"
                    keyboardType="numeric"
                />
                <Text style={[styles.title, invalid==='password' && { color: 'red' }]}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="••••••••••"
                    secureTextEntry={true}
                />
                {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                <MenuButton text="Loguearse" onPress={validateAndLogIn} style={{height: 75}}/>
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