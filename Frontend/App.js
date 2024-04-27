import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [ratio, setRatio] = useState(null);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  
  async function takePicture() {
    let options = {
      quality: 1,
      base64: true,
      exif: false
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
  };

  return (
    <View style={styles.container}>
      {!photo ?
        <View style={styles.container}>
          <View style={styles.roundedContainer}>
            <Camera style={styles.camera} type={type} pictureSize='1600x1200' ref={cameraRef} />
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Text style={styles.text}>Take Picture</Text>
              </TouchableOpacity>
            </View>
        </View>
      :
        <View style={styles.container}>
          <Image source={{ uri: photo }} style={styles.roundedContainer} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
              <Text style={styles.text}>Retake Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  roundedContainer: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 30,
    marginTop: '10%',
    marginHorizontal: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions.get('window').height *.9 - Dimensions.get('window').width*.7*4/3 - 50 - 35, //total pantalla -margen superior - altura camara - margen botones - alto texto botones
  },
  camera: {
    aspectRatio: 3/4,
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});
