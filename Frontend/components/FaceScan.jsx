import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import MenuButton from './MenuButton';
import LandmarksSvg from './LandmarksSvg';
import ScanAnimation from './ScanAnimation';
import Toast from "react-native-toast-message";
import { userStateValidator } from '../services/LoginValidator.js'
import { getDescriptors } from '../services/Api.js';
import { createLoginLog } from '../service_db/DBQuerys.jsx';
import { matchFaces } from '../services/FaceMatcher.js';
import Flip from '../assets/svg/flip.svg'
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function FaceScan({ data, after }) {
	const [type, setType] = useState(CameraType.front);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [photo, setPhoto] = useState(null);
	const [size, setSize] = useState("640x480");
	const [landmarks, setLandmarks] = useState(null);
	const cameraRef = useRef(null);
	const register = data.register;

	useEffect(() => {
		if (!photo) return;
		getDescriptors(photo.base64).then(async (response) => {
			let closest = null;
			if (response && response.length > 0) {
				setLandmarks(response);
				const descriptors = Object.values(response[0].descriptor);
				if (register) {
					Toast.show({
						type: 'success',
						text1: 'Identidad capturada correctamente.',
					})
					after(descriptors)
					return
				};
				closest = await matchFaces(descriptors);

			}
			// Comprueba el estado del usuario si está dado de baja o no
			if (!closest ||
				!closest.person ||
				closest.distance > 0.65 ||
				! await userStateValidator(closest.person)) {
					Toast.show({
						type: 'error',
						text1: 'No he podido identificarte.',
						text2: 'Vuelve a intentarlo, si no lo haz hecho, registrate.'
					})
					setPhoto(null)	
			} else if (closest.distance < 0.50) {
				Toast.show({
					type: 'success',
					text1: `Identidad Validada: ${closest.person}.`,
					text2: `Distancia: ${closest.distance}`
				})
				// Crea un log del login
				createLoginLog(closest.person);
				after(closest.person);
			} else {
				Toast.show({
					type: 'info',
					text1: `Te pareces a ${closest.person}!`,
					text2: 'Vuelve a intentarlo o, si no lo haz hecho, registrate!'
				})
				setPhoto(null)
			}
	});
	}, [photo]);
	
	if (!permission) {
		// Camera permissions are still loading
		return <View style={{ flex: 1 }} />;
	}

    if (!permission.granted) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', width: '80%', alignSelf: 'center'}]}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Necesitamos permiso para usar la camara</Text>
				<MenuButton text="Dar  permiso" style={{ height: 50 }} onPress={requestPermission}/>
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
		if (img.height == 640) return img;
		const resizedPhoto = await ImageManipulator.manipulateAsync(
			img.uri,
			[{ resize: { width: 480, height: 640 } }],
			{ compress: 1, base64: true, compress: 0.5 }
		);
		return resizedPhoto;
	}
	async function takePicture() {
		let options = {
			quality: 0.5,
			base64: true,
			exif: false,
		};
		setLandmarks(null);
		if (cameraRef) {
			let newPhoto;
			try {
				newPhoto = await cameraRef.current.takePictureAsync(options).then(resizeImage);
			} catch (error) {
				Toast.show({
					type: 'error',
					text1: 'Error al tomar la foto',
					text2: error.message
				})
			}
			setPhoto(newPhoto);
		}
	}

	return (
		<View style={styles.container}>
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
						<TouchableOpacity
							onPress={toggleCameraType}
							style={styles.flip}>
							<Flip fill="white" />
						</TouchableOpacity>
					</View>
					<View style={styles.buttonContainer}>
						<MenuButton
							text="Validar Identidad"
							onPress={takePicture}
							style={styles.button}
						/>
					</View>
				</View>
			) : (
				<View style={styles.container}>
					<View style={styles.roundedContainer}>
						<Image source={{ uri: photo.uri }} style={styles.camera} />
						{ landmarks ?
							<LandmarksSvg landmarks={landmarks} /> :
							<ScanAnimation />}
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
		justifyContent: "center",
		flexDirection: "column",
		justifyContent: "space-between",
		position: "relative",
		paddingTop: 20
	},
	roundedContainer: {
		position: "relative",
		justifyContent: "center",
		overflow: "hidden",
		borderRadius: 30,
		marginHorizontal: "15%",
		alignItems: "center",
		aspectRatio: 3 / 4,
	},
	camera: {
		aspectRatio: 3 / 4,
		height: "100%",
	},
	flip: {
		width: 30,
		height: 30,
		position: "absolute",
		bottom: 15,
		right: 15,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginHorizontal: "15%",
	},
	button: {
		height: 100,
	}
});
