import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import MenuButton from '../components/MenuButton';
import BackButton from '../components/BackButton';
import LandmarksSvg from '../components/LandmarksSvg';
import ScanAnimation from '../components/ScanAnimation';
import people from '../data/people.json';
import Toast from "react-native-toast-message";

export default function FaceScan({ onPress }) {
	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [photo, setPhoto] = useState(null);
	const [size, setSize] = useState("640x480");
	const [landmarks, setLandmarks] = useState(null);
	const cameraRef = useRef(null);

	useEffect(() => {
		if (!photo) return;
		recognizeFaces(photo.base64).then((response) => {
			let closest = null;
			if (response && response.length > 0) {
				setLandmarks(response);
				closest = matchFaces(Object.values(response[0].descriptor));
			}
			// Aca, cuando ande, habria q usar const userState = await userStateValidator(closestFaceId);
			if (!closest || closest.distance > 0.65) {
				Toast.show({
					type: 'error',
					text1: 'No he podido identificarte',
					text2: 'Vuelve a intentarlo o, si no lo haz hecho, registrate!'
				})
				setPhoto(null)
			} else if (closest.distance < 0.55) {
				Toast.show({
					type: 'success',
					text1: `Hola ${closest.person}!`,
					text2: `Distancia: ${closest.distance}`
				})
				onPress('cancel');
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
		justifyContent: "space-around",
		position: "relative",
	},
	roundedContainer: {
		position: "relative",
		justifyContent: "center",
		overflow: "hidden",
		borderRadius: 30,
		marginHorizontal: "20%",
		alignItems: "center",
		aspectRatio: 3 / 4,
	},
	camera: {
		aspectRatio: 3 / 4,
		height: "100%",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	button: {
		width: "40%",
		height: 100,
	}
});

const API_URL = 'https://foodpass.onrender.com';
// const API_URL = 'https://quality-cicada-wrongly.ngrok-free.app';
const recognizeFaces = async (base64Image) => {
	if (!base64Image) throw new error('Error: Tried to recognize faces with no image');
	try {
		let startTime = performance.now();
		const response = await fetch(API_URL + '/recognizeFaces', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ base64Image }),
		});
		// console.log(`Request time: ${performance.now()-startTime}ms`);
		if (response.ok) {
			const responseData = await response.json();
			return responseData;
		} else {
			Toast.show({
				type: 'error',
				text1: 'Failed to upload image',
				text2: `Error status: ${response.status}`
			})
		}
	} catch (error) {
		Toast.show({
			type: 'error',
			text1: 'Error uploading image:',
			text2: error.message
		})
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
	// En vez de people, habria que usar const faces = await getFacesValidator();
	for (const otherPerson in people) {
		const otherFace = Object.values(people[otherPerson]);
		const distance = euclideanDistance(face, otherFace);
		if (distance < closestDistance) {
			closestPerson = otherPerson;
			closestDistance = distance;
		}
	}
	return { 'person': closestPerson, 'distance': closestDistance };
}
