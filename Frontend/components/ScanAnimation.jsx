import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

export default function ScanAnimation() {
    const translateY = useRef(new Animated.Value(0)).current;
    const [containerHeight, setContainerHeight] = useState(0);
    const onContainerLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height);
    };

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateY, {
                    toValue: -containerHeight / 2,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
                Animated.delay(500),
                Animated.timing(translateY, {
                    toValue: containerHeight / 2,
                    duration: 1000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.delay(500),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.ease),
                }),
            ])
        ).start();
    }, [translateY, containerHeight]);

    return (
        <View style={styles.container} onLayout={onContainerLayout} >
            <Animated.View
                style={[
                    styles.line,
                    {
                        transform: [{ translateY }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    line: {
        width: '100%',
        height: 4,
        backgroundColor: 'cyan',
    },
});
