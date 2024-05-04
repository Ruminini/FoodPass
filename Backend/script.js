const { Canvas, Image, ImageData } = require('canvas');
const faceapi = require('face-api.js');
const { loadImage } = require('canvas');

// Define la ruta del modelo
const MODEL_URL = '../Backend/models';

// Configura face-api.js para usar node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Carga los modelos necesarios
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
}

// Función para detectar rostros en una imagen
async function detectFaces(imagePath) {
    const image = await loadImage(imagePath);
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    return detections;
}

// Ruta de la imagen
const imagePath = '../Backend/images/breaking_bad.';

// Carga los modelos y detecta los rostros en la imagen
export async function runFR() {
    await loadModels();
    const detections = await detectFaces(imagePath);
    console.log(detections);
}