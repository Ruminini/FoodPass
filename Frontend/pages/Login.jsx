import {
	StyleSheet,
	Text,
	View,
	Button,
	Image,
	Alert,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useState, useEffect, useRef } from "react";
import MenuButton from "../components/MenuButton";
import BackButton from "../components/BackButton";
import ScanAnimation from "../components/ScanAnimation";
import {getFacesValidator} from '../services/OnlineLoginValidator';
import NetInfo from '@react-native-community/netinfo';

export default function Login({ onPress }) {
	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [photo, setPhoto] = useState(null);
	const [size, setSize] = useState("640x480");
	const cameraRef = useRef(null);
	const [showNoConnectionAlert, setShowNoConnectionAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    
	//Comprueba si hay conexión al momento del log in y si no hay muestra una alerta para redirigirlo a la página de login sin conexión
	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
		  if (!state.isConnected) {
			setShowNoConnectionAlert(true);
		  } else {
			setShowNoConnectionAlert(false);
		  }
		});
	
		return () => {
		  unsubscribe();
		};
	  }, []);
	
	if (!permission) {
		// Si los permisos de la cámara aún están cargando
		return <View />;
	}

	if (!permission.granted) {
		// Si los permisos de la cámara aún están pendientes
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}
	
	async function getPictureSizes() {
		if (!cameraRef || cameraRef.current == null) return;
		cameraRef.current.getAvailablePictureSizesAsync('4:3')
		.then(sizes => {
			//make newSize the closest size <= 640x480
			const newSize = sizes.filter(res => res.split('x')[0] <= 640).pop();
			setSize(newSize);
		})
		.catch(error => {
			console.error('Error getting picture sizes:', error);
		});
	}

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
		getPictureSizes();
	}

	async function resizeImage(img) {
		if (img.height == 640) return img;
		const resizedPhoto = await ImageManipulator.manipulateAsync(
			img.uri,
			[{ resize: { width: 480, height: 640 } }],
			{ compress: 1, base64: true, compress: 0.5 }
		);
		console.log('resized',img.height,'to',resizedPhoto.height);
		return resizedPhoto;
	}

	async function takePicture() {
		let options = {
			quality: 0.5,
			base64: true,
			exif: false,
		};

		if (cameraRef) {
            try {
				let newPhoto = await cameraRef.current.takePictureAsync(options).then(resizeImage);
				setPhoto(newPhoto.uri);

				Alert.alert('Comprobando datos', 'Por favor, espera...', [{ text: 'OK' }]);
				setLoading(true);

				const response = await recognizeFaces(newPhoto.base64);
                // Si hay alguna cara en la imagen entonces realiza la comparación con la base de datos
				if (response && response.length > 0) {
					const closestFace = await matchFaces(Object.values(response[0].descriptor));
					setLoading(false);
					Alert.alert(
						'Comprobación exitosa',
						[{ 
                            text: 'OK',
                            // Se envia al usuario a la página para retirar el pedido
                            onPress: () => onPress({ userId: "closestFace.id", page: 'orderPickUp' }),
                         }],
					);
				} else {
                    Alert.alert(
						'Comprobación fallida',
                        'Registrese primero o pruebe a retomar la foto con su cara',
						[{ 
                            text: 'OK',
                         }],
					);
                }
			} catch (e) {
				console.log(e);
				setLoading(false);
				Alert.alert('Error', 'Ocurrió un error al tomar la foto o reconocer el rostro.', [{ text: 'OK' }]);
			}
		}
	}

    // Si no hay conexión muestra la página con el login offline
	const handleLoadLoginOffline = () => {
		onPress({ userId: null, page: 'noConnection' });
		setShowNoConnectionAlert(false); // Cerrar la alerta después de cargar el login offline
	  };


	return (
		<View style={styles.container}>
			<BackButton onPress={() => onPress('cancel')} />
			{showNoConnectionAlert && (
				Alert.alert(
				'No hay conexión a internet',
				'Pruebe con el login manual',
				[
					{
					text: 'Cargar login offline',
					onPress: handleLoadLoginOffline,
					},
				],
				)
			)}
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
							text="Voltear cámara"
							onPress={toggleCameraType}
							style={styles.button}
						/>
						<MenuButton
							text="Tomar foto"
							onPress={takePicture}
							style={styles.button}
						/>
					</View>
				</View>
			) : (
				<View style={styles.container}>
					<View style={styles.roundedContainer}>
						<Image source={{ uri: photo }} style={{ aspectRatio: 3 / 4, height: "100%", width: "100%" }} />
						
					</View>
					<View style={styles.buttonContainer}>
						<MenuButton
							text="Retomar foto"
							onPress={() => { setPhoto(null);}}
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
	},
});


const API_URL = 'https://foodpass.onrender.com';
const recognizeFaces = async (base64Image) => {
	if (!base64Image) throw new error('Error: Tried to recognize faces with no image');
	try {
		let startTime = performance.now();
		const response = await fetch(API_URL + '/recognizeFaces', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ base64Image }),
		});
		console.log('Request time:',performance.now()-startTime, 'ms');
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

// Función para matchear los descriptores de los rostros de las personas a partir de su distancia euclideana, si es menor a ??? la distancia entonces son la misma persona.
// Por cada descriptor busco el que esté más cerca en la distancia euclideana. Si no hay ninguno significa que esa persona no está registrada.
export async function matchFaces(descriptor_from_login) {
	try {
		const faces = await getFacesValidator();
		let closestFace = null;
		let closestDistance = Infinity;
		faces.forEach(face => {
			const descriptor_from_db = JSON.parse(face.descriptor);
			const distance = euclideanDistance(descriptor_from_login, descriptor_from_db);
			if (distance < closestDistance) {
				closestFace = face;
				closestDistance = distance;
			}
		});
		console.log(`Persona más cercana: ${closestFace}, distancia: ${closestDistance}`);
		return closestFace;
	} catch (error) {
		console.error('Error al encontrar el descriptor más cercano:', error);
		throw error;
	}      
}

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
