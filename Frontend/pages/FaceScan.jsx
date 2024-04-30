import {
	StyleSheet,
	Text,
	View,
	Button,
	Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useState, useRef } from "react";
import MenuButton from "../components/MenuButton";

export default function FaceScan() {
	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [photo, setPhoto] = useState(null);
	const cameraRef = useRef(null);

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

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	}

	async function takePicture() {
		let options = {
			quality: 1,
			base64: true,
			exif: false,
		};
		if (cameraRef) {
			try {
				const newPhoto = await cameraRef.current.takePictureAsync(options);
				console.log(newPhoto);
				setPhoto(newPhoto.uri);
			} catch (e) {
				console.log(e);
			}
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
							pictureSize="1600x1200"
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
					<Image source={{ uri: photo }} style={styles.roundedContainer} />
					<View style={styles.buttonContainer}>
						<MenuButton
							text="Retake Picture"
							onPress={() => setPhoto(null)}
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
