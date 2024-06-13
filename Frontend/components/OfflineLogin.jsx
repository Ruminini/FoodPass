import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import MenuButton from './MenuButton';
import { validateId, validatePassword, userStateValidator} from '../services/LoginValidator';
import Toast from 'react-native-toast-message';
import { createLoginLog, validateGuest } from '../service_db/DBQuerys.jsx';

export default function OfflineLogin({ data, after }) {
    const [password, onChangePassword] = useState('');
    const [id, onChangeId] = useState('');
    const [invalid, setInvalid] = useState('');
    const guest = data?.guest;

    const validateAndLogIn = async () => {
        // Validación del formato del legajo
        if (guest ? !id.match(/^[0-9]{8}$/) : !id.match(/^[0-9]{8}-[0-9]{4}$/)) {
            Toast.show({ 
                type: 'info', 
                text1: guest ?
                    'Formato de DNI incorrecto.':
                    'Formato de legajo incorrecto.',
                text2: guest ?
                    'Formato correcto: 8 dígitos.' :
                    'Formato correcto: 8 dígitos - (guión) 4 dígitos.'
            });
            setInvalid('id')
            return false;
        }
        // Validación del legajo con los legajos de usuarios registrados en la base de datos
        try {
            const idIsValid = await validateId(guest ? id + '-9999' : id);
            
            if (!idIsValid) {
                Toast.show({ 
                    type: 'info', 
                    text1: (guest ? 'DNI': 'Legajo') + ' no registrado',
                });
                setInvalid('id')
                return false;
            }
        } catch (error) {
            console.error('Error al validar el legajo:', error);
            return false;
        }

        // Validación de la contraseña en la base de datos
        try {
            const passwordIsValid = await validatePassword(guest ? id + '-9999' : id, password);
            if (!passwordIsValid) {
                Toast.show({ 
                    type: 'error', 
                    text1: 'Contraseña incorrecta'
                });
                return false;
            }
        } catch (error) {
            console.error('Error al validar la contraseña:', error);
            return false;
        }

        //Validación del estado del usuario
        
        try {
            const userState = await userStateValidator(guest ? id + '-9999' : id);
            const guestState = guest ? await validateGuest(id) : true;
            
            if(!userState || !guestState) {
                Toast.show({ 
                    type: 'info', 
                    text1: 'El usuario está dado de baja. Vuelva a registrarse'
                });
                return false;
            }
        } catch (error) {
            console.error('Error al validar el estado del usuario:', error);
            return false;
        }
        // Crea un log del login
        createLoginLog(guest ? id + '-9999' : id);
        after(guest ? id + '-9999' : id),
        console.log('Usuario logueado')       
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={[styles.title, invalid==='id' && { color: 'red' }]}>{guest ? 'DNI' : 'Legajo'}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeId}
                    value={id}
                    placeholder={guest ? "12345678" : "12345678-0000"}
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
                <MenuButton text="Validar" onPress={validateAndLogIn} style={{height: 75}}/>
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