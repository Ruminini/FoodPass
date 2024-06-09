import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import FaceScan from '../components/FaceScan';
import OfflineLogin from '../components/OfflineLogin';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';

export default function Login({ data, before, after }) {
	const [internet, setInternet] = useState(true);
	const [register, setRegister] = useState(data.register);
	const [guest, setGuest] = useState(data.guest);
    useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setInternet(state.isConnected);
		});
        return unsubscribe;
	}, []);
    useEffect(() => {
        if (!internet) {
            if (register) {
                Toast.show({
                    type: 'error',
                    text1: 'Internet required for face recognition',
                })
                before()
            } else if (!guest) {
                Toast.show({
                    type: 'info',
                    text1: 'No internet connection, using Offline Login',
                })
            }
        }
    }, [internet]);

    return (
        <View style={{flex: 1}}>
        {guest ? (
            <OfflineLogin data={{...data, guest: true}} after={after} />
        ) : internet ? (
            <FaceScan data={data} after={after} />
        ) : (
            <OfflineLogin after={after} />
        )}
        <Text
        onPress={() => setGuest(!guest)}
        style={styles.link}>{guest ? 'No soy Invitado' : 'Soy Invitado'}</Text>
        <BackButton onPress={guest ? () => setGuest(false) : before}/>
        </View>
    )
}

const styles = StyleSheet.create({
    link: {
        textAlign: 'center',
        fontSize: 20,
        color: 'blue',
        height: 50
    },
});