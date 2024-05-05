import {
	StyleSheet,
	Text,
	View,
	Button,
	Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import MenuButton from "../components/MenuButton";
import BackButton from "../components/BackButton";
import LandmarksSvg from "../components/LandmarksSvg";

export default function FaceScan({onPress}) {
	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [photo, setPhoto] = useState(null);
	const [size, setSize] = useState("320x240");
	const [landmarks, setLandmarks] = useState(null);
	const cameraRef = useRef(null);
	useEffect(() => getPictureSizes, [type]);

	if (!permission) {
		// Camera permissions are still loading
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet
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
			console.log('Available picture sizes:', sizes);
			setSize(sizes[0]);
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

	async function takePicture() {
		let options = {
			quality: 1,
			base64: true,
			exif: false,
		};
		if (cameraRef) {
			try {
				setLandmarks(null);
				const newPhoto = await cameraRef.current.takePictureAsync(options);
				console.log(Object.keys(newPhoto));
				recognizeFaces(newPhoto.base64).then((response) => {
					setLandmarks(response);
				})
				
				setPhoto(newPhoto.uri);
			} catch (e) {
				console.log(e);
			}
		}
	}

	return (
		<View style={styles.container}>
			<BackButton onPress={() => onPress('cancel')}/>
			{!photo ? (
				<View style={styles.container}>
					<View style={styles.roundedContainer}>
						<Camera
							style={styles.camera}
							type={type}
							pictureSize={size}//"1600x1200"
							ref={cameraRef}
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
					<Image source={{ uri: photo }} style={{ aspectRatio: 3 / 4, height: "100%", width: "100%"}} />
					{landmarks && <View style={styles.landmarks} ><LandmarksSvg landmarks={landmarks} style={{flex: 1}}/></View>}
					</View>
					<View style={styles.buttonContainer}>
						<MenuButton
							text="Retake Picture"
							onPress={() => {setPhoto(null); setLandmarks(null);}}
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
	landmarks: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	}
});


const API_URL = 'https://quality-cicada-wrongly.ngrok-free.app';
const recognizeFaces = async (base64Image) => {
    if (!base64Image) {
		console.error('Error: Tried to recognize faces with no image');
      return;
    }

    try {
      const response = await fetch(API_URL+'/recognizeFaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image }),
      });
	  console.log(await response.body)
      if (response.ok) {
        const responseData = await response.json();
        console.log('Image uploaded successfully:', responseData);
		return responseData;
      } else {
        console.error('Failed to upload image:', response.status);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };