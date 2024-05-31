import React, { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo';
import { View } from 'react-native';
import FaceScan from '../components/FaceScan';
import OfflineLogin from '../components/OfflineLogin';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';

export default function Login({ data, before, after }) {
	const [internet, setInternet] = useState(true);
    useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setInternet(state.isConnected);
		});
        return unsubscribe;
	}, []);
    useEffect(() => {
        if (!internet) {
            if (data.onlyDescriptors) {
                Toast.show({
                    type: 'error',
                    text1: 'Internet required for face recognition',
                })
                before()
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'No internet connection, using Offline Login',
                })
            }
        }
    }, [internet]);

    return (
        <View style={{flex: 1}}>
        { internet ?
            <FaceScan data={data} after={after}/>
            :
            <OfflineLogin after={after}/> 
        }
        <BackButton onPress={before} />
        </View>
    )
}