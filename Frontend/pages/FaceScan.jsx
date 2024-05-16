import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import MenuButton from '../components/MenuButton';
import BackButton from '../components/BackButton';
import LandmarksSvg from '../components/LandmarksSvg';
import ScanAnimation from '../components/ScanAnimation';
import people from '../data/people.json';
import NetInfo from '@react-native-community/netinfo';

export default function FaceScan({ onPress, onDescriptorsTaken, onPhotoTaken }) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const [size, setSize] = useState('640x480');
    const [landmarks, setLandmarks] = useState(null);
    const [showNoConnectionAlert, setShowNoConnectionAlert] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setShowNoConnectionAlert(!state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    async function getPictureSizes() {
        if (!cameraRef.current) return;
        cameraRef.current
            .getAvailablePictureSizesAsync('4:3')
            .then((sizes) => {
                const newSize = sizes.filter((res) => res.split('x')[0] <= 640).pop();
                setSize(newSize);
            })
            .catch((error) => {
                console.error('Error getting picture sizes:', error);
            });
    }

    function toggleCameraType() {
        setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
        getPictureSizes();
    }

    async function resizeImage(img) {
        if (img.height === 640) return img;
        const resizedPhoto = await ImageManipulator.manipulateAsync(img.uri, [{ resize: { width: 480, height: 640 } }], {
            compress: 1,
            base64: true,
            compress: 0.5,
        });
        console.log('Resized', img.height, 'to', resizedPhoto.height);
        return resizedPhoto;
    }

    async function takePicture() {
        let options = {
            quality: 0.5,
            base64: true,
            exif: false,
        };
        setLandmarks(null);
        if (cameraRef.current) {
            try {
                let newPhoto = await cameraRef.current.takePictureAsync(options).then(resizeImage);
                recognizeFaces(newPhoto.base64).then((response) => {
                    setLandmarks(response);
                    if (response && response.length > 0) {
                        matchFaces(Object.values(response[0].descriptor));
                        onDescriptorsTaken(Object.values(response[0].descriptor)); // Almacena los descriptores obtenidos
                    }
                });
                setPhoto(newPhoto.uri);
                onPhotoTaken(true); // Notifica que se ha tomado una foto
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleLoadLoginOffline = () => {
        onPress('noConnection');
        setShowNoConnectionAlert(false);
    };

	return (
		<View style={styles.container}>
			<BackButton onPress={() => onPress('cancel')} />
			{showNoConnectionAlert && 
				Alert.alert(
					'No hay conexión a internet',
					'Pruebe con el login manual',
					[
						{ text: 'Cargar login offline', onPress: handleLoadLoginOffline },
					]
				)
			}
			{!photo ? (
				<View style={styles.container}>
					<View style={styles.roundedContainer}>
						<Camera
							style={styles.camera}
							type={type}
							pictureSize={size}
							ref={cameraRef}
							onCameraReady={getPictureSizes}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<MenuButton
							text="Flip Camera"
							onPress={toggleCameraType}
							style={styles.button}
						/>
						<MenuButton
							text="Take Picture"
							onPress={takePicture}
							style={styles.button}
						/>
					</View>
				</View>
			) : (
				<View style={styles.container}>
					<View style={styles.roundedContainer}>
						<Image source={{ uri: photo }} style={{ aspectRatio: 3 / 4, height: '100%', width: '100%' }} />
						<View style={styles.landmarks} >
							{landmarks && <LandmarksSvg landmarks={landmarks} style={{ flex: 1 }} />}
						</View>
						{!landmarks && <ScanAnimation />}
					</View>
					<View style={styles.buttonContainer}>
						<MenuButton
							text="Retake Picture"
							onPress={() => { setPhoto(null); setLandmarks(null); }}
							style={styles.button}
						/>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        position: 'relative',
    },
    roundedContainer: {
        position: 'relative',
        justifyContent: 'center',
        overflow:'hidden',
        borderRadius: 30,
        marginHorizontal: '20%',
        alignItems: 'center',
        aspectRatio: 3 / 4,
    },
    camera: {
        aspectRatio: 3 / 4,
        height: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        width: '40%',
        height: 100,
    },
    landmarks: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

const API_URL = 'https://foodpass.onrender.com';
// const API_URL = 'https://quality-cicada-wrongly.ngrok-free.app';
const recognizeFaces = async (base64Image) => {
    if (!base64Image) throw new Error('Error: Tried to recognize faces with no image');
    try {
		// const health = await fetch(API_URL + '/health', {
		// 	method: 'GET',
		// 	headers: { 'Content-Type': 'application/json' }
		// });
		// if (!health.ok) {
		// 	console.error('Failed to check health:', health.status);
		// 	return;
		// } else {
		// 	console.log('Health check successful');
		// }
		let startTime = performance.now();
		const response = await fetch(API_URL + '/recognizeFaces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Image }),
        });
        console.log('Request time:', performance.now() - startTime, 'ms');
        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            console.error('Failed to upload image:', response.status);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};

function euclideanDistance(vector1, vector2) {
    if (vector1.length !== vector2.length) {
        throw new Error('Vectors must be of the same length');
    }
    let sumOfSquares = 0;
    for (let i = 0; i < vector1.length; i++) {
        const difference = vector1[i] - vector2[i];
        sumOfSquares += difference * difference;
    }
    return Math.sqrt(sumOfSquares);
}

function matchFaces(face) {
    let closestPerson = null;
    let closestDistance = Infinity;
    for (const otherPerson in people) {
        const otherFace = Object.values(people[otherPerson]);
        const distance = euclideanDistance(face, otherFace);
        if (distance < closestDistance) {
            closestPerson = otherPerson;
            closestDistance = distance;
        }
    }
    console.log(`Closest person: ${closestPerson}, distance: ${closestDistance}`);
}
