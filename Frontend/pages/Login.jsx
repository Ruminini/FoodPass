import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import FaceScan from './FaceScan';
import OfflineLogin from './OfflineLogin';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';

export default function Login({ onPress, onSuccess }) {
	const [internet, setInternet] = useState(true);
    useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setInternet(state.isConnected);
            if (!state.isConnected) {
                Toast.show({
                    type: 'info',
                    text1: 'No internet connection, using Offline Login',
                })
            }
		});
        return unsubscribe;
	}, []);

    return (
        <View style={{flex: 1}}>
        { internet ?
            <FaceScan onSuccess/>
            :
            <OfflineLogin onSuccess/> 
        }
        <BackButton onPress={() => onPress('cancel')} />
        </View>
    )
}