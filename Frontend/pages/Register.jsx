import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import { validateId, validatePassword, registerPassword} from '../services/RegisterValidator';

export default function Register({onPress}) {
    const [password, onChangePassword] = useState('');
    const [id, onChangeId] = useState('');
    const [invalid, setInvalid] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateAndRegister = async () => {
        // Validación del formato del legajo
        if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            setErrorMessage('')
            setInvalid('id')
            return false;
        }

        // Validación del formato de la password
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            setErrorMessage('')
            setInvalid('password')
            return false;
        }

        // Validación del legajo en la base de datos
        try {
            const idIsValid = await validateId(id);
            if (!idIsValid) {
                setErrorMessage('No es un legajo válido.');
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
                setErrorMessage('El usuario ya se encuentra registrado.');
                resetForm();
                return false;
            }
        } catch (error) {
            console.error('Error al validar la contraseña:', error);
            return false;
        }

        // Registrar contraseña del usuario en la base de datos
        try {
            const passwordRegistred = await registerPassword(id, password);
            if (!passwordRegistred) {
                setErrorMessage('Ocurrió un error inesperado, comuniquese con su empleador.');
                console.log('Error al intentar registrar el usuario.')
                return false;
            } else {
                console.log('Usuario registrado.')
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            return false;
        }

        onPress({ id, password });
        }

    const resetForm = () => {
        onChangeId('');
        onChangePassword('');
        setInvalid('');
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
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        fontSize: 20,
    },
});
