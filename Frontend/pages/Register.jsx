import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import FaceScan from './FaceScan';
import { validateId, validatePassword, registerMember } from '../services/RegisterValidator';
import insertFaceDescriptors from '../services/RegisterDescriptors';

export default function Register({ onPress }) {
    const [password, onChangePassword] = useState('');
    const [id, onChangeId] = useState('');
    const [invalid, setInvalid] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showFaceScan, setShowFaceScan] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [descriptors, setDescriptors] = useState(null);

    const validateAndRegister = async () => {

        // Validación del formato del legajo
        if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            setErrorMessage('');
            setInvalid('id');
            return false;
        }

        // Validación del formato de la contraseña
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            setErrorMessage('');
            setInvalid('password');
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

        // Validación de la foto tomada
        if (!photoTaken) {
            Alert.alert('Error', 'Por favor, primero tome una foto.');
            return false;
        }

        // Validación de la foto tomada y los descriptores
        if (photoTaken && descriptors === null) {
            setErrorMessage('No se pudieron obtener datos del rostro. Intente nuevamente.');
            return false;
        }

        // Registrar miembro en la base de datos
        try {
            const memberRegistered = await registerMember(id, password);
            if (!memberRegistered) {
                setErrorMessage('Ocurrió un error inesperado, comuníquese con su empleador.');
                console.log('Error al intentar registrar el usuario.');
                return false;
            } else {
                console.log('Usuario registrado.');
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            return false;
        }

        // Registrar descriptores del rostro en la base de datos
        try {
            const faceRegistred = await insertFaceDescriptors(id, descriptors);
            if (!faceRegistred) {
                setErrorMessage('Ocurrió un error inesperado, comuníquese con su empleador.');
                console.log('Error al intentar almacenar descritores del usuario.');
                return false;
            } else {
                console.log('Descriptores del usuario almacenados.');
            }
        } catch (error) {
            console.error('Error al almacenar descriptores del usuario:', error);
            return false;
        }

        onPress({ id, password, descriptors });
    };

    const resetForm = () => {
        onChangeId('');
        onChangePassword('');
        setInvalid('');
    };

    return (
        <View style={{ flex: 1 }}>
            {!showFaceScan ? ( // Mostrar el formulario normal mientras no se active FaceScan
                <>
                    <BackButton onPress={() => onPress('cancel')} />
                    <View style={styles.container}>
                        <Text style={[styles.title, invalid === 'id' && { color: 'red' }]}>Legajo</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeId}
                            value={id}
                            placeholder="12345678-4321"
                            keyboardType="numeric"
                        />
                        <Text style={[styles.title, invalid === 'password' && { color: 'red' }]}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangePassword}
                            value={password}
                            placeholder="••••••••••"
                            secureTextEntry={true}
                        />
                        {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                        <MenuButton text="Tomar foto" onPress={() => setShowFaceScan(true)} style={{ height: 75, width: 300, alignSelf: 'center'}} />
                        <MenuButton text="Registrar" onPress={validateAndRegister} style={{ height: 75, width: 300, alignSelf: 'center'}} />
                        
                    </View>
                </>
            ) : (
                <FaceScan onPress={() => setShowFaceScan(false)} onDescriptorsTaken={setDescriptors} onPhotoTaken={setPhotoTaken} /> // Mostrar FaceScan cuando se active
            )}
        </View>
    );
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
        fontSize: 25,
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
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        fontSize: 20,
    },
});
