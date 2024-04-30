import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Svg from 'react-native-svg';

export default function MenuButton({ text, onPress, svg, style }) {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            {svg ? (
                <View style={styles.icon}>
                    <Svg width={50} height={50}>
                        {svg}
                    </Svg>
                </View>
            ) : 
				null
			}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingRight: 25,
        elevation: 2,
        marginVertical: 15,
		width: '100%',
    },
    icon: {
        margin: 25,
    },
    text: {
		flex: 1,
        fontSize: 30,
        fontWeight: '400',
        color: 'black',
        textAlign: 'center',
        minHeight: 50,
    },
});
