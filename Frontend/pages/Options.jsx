import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import { updatePasswordMember, desactiveMember } from '../services/MemberOptions';

export default function Options({ goTo }) {
    const [id, setId] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [invalid, setInvalid] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateAndUpdatePassword = async () => {
        // Validación del formato del legajo
        if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            setErrorMessage('');
            setInvalid('id');
            return false;
        }

        // Validación del formato de la contraseña actual
        if (!oldPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            setErrorMessage('');
            setInvalid('oldPassword');
            return false;
        }

        // Validación del formato de la nueva contraseña
        if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            setErrorMessage('');
            setInvalid('newPassword');
            return false;
        }

        // Actualizar nueva contraseña en la base de datos
        try {
            const passwordUpdated = await updatePasswordMember(id, oldPassword, newPassword);
            if (!passwordUpdated) {
                setErrorMessage('Legajo y/o contraseña incorrecto/s.');
                resetForm();
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }

        goTo({ id, oldPassword, newPassword });
    };

    const confirmDeleteMember = () => {
        // Validación del formato del legajo
        if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            setErrorMessage('');
            setInvalid('id');
            return false;
        }

        // Validación del formato de la contraseña actual
        if (!oldPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
            setErrorMessage('');
            setInvalid('oldPassword');
            return false;
        }

        Alert.alert(
            "Confirmación",
            "¿Estás seguro que deseas darte de baja?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Sí", onPress: deleteMember }
            ],
            { cancelable: false }
        );
    };

    const deleteMember = async () => {
        // Dar de baja a un miembro del sistema
        try {
            const desactive = await desactiveMember(id, oldPassword);
            if (!desactive) {
                setErrorMessage('No se pudo dar de baja al miembro.');
                resetForm();
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
        // TODO : Dar de baja al miembro
    };

    const resetForm = () => {
        setId('');
        setOldPassword('');
        setNewPassword('');
        setInvalid('');
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={[styles.title, invalid === 'id' && { color: 'red' }]}>Legajo</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setId}
                    value={id}
                    placeholder="12345678-4321"
                    keyboardType="numeric"
                />
                <Text style={[styles.title, invalid === 'oldPassword' && { color: 'red' }]}>Contraseña actual</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setOldPassword}
                    value={oldPassword}
                    placeholder="••••••••••"
                    secureTextEntry={true}
                />
                <Text style={[styles.title, invalid === 'newPassword' && { color: 'red' }]}>Contraseña nueva</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setNewPassword}
                    value={newPassword}
                    placeholder="••••••••••"
                    secureTextEntry={true}
                />
                {errorMessage !== '' && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                <MenuButton 
                    text="Cambiar contraseña" 
                    onPress={validateAndUpdatePassword} 
                    style={styles.menuButton}
                />
                <MenuButton 
                    text="Darse de baja" 
                    onPress={confirmDeleteMember} 
                    style={[styles.menuButton, styles.deleteButton]}
                />
            </View>
            <BackButton onPress={() => goTo('MainMenu')} />
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
    menuButton: {
        height: 75,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#E53935',
        height: 50,
        alignSelf: 'center',
        width: 250,
        position: 'absolute',
        bottom: 20,
    },
});
