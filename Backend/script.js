const { Canvas, Image, ImageData } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const faceapi = require('@vladmandic/face-api');
const { loadImage } = require('canvas');
const fs = require('fs');
require('dotenv').config()

const MODEL_URL = process.env.MODEL_URL || './models';
const PORT = process.env.PORT || 3000;
const EMAIL = process.env.EMAIL || null;
const PASSWORD = process.env.PASSWORD || null;
const MAIL_KEY = process.env.MAIL_KEY || null;

// Configura face-api.js para usar node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Carga los modelos
async function loadModels() {
    faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
}

// Detecta uno o mas rostros en una imagen
async function detectFaces(base64Image) {
    const image = await loadImage(base64Image);
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    return detections;
}


async function main() {
    await faceapi.tf.setBackend('tensorflow');
    await faceapi.tf.ready();
    await loadModels();

    runServer();
}

async function runServer() {
    const express = require('express');
    const app = express();
    app.use(express.json({ limit: '10mb' }));

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    // Detecta uno o mas rostros en una imagen
    app.post('/recognizeFaces', async (req, res) => {
        const { base64Image } = req.body;
        if (!base64Image) {
            return res.status(400).json({ error: 'Missing base64Image field in the request body' });
        }
        try {
            const detections = await detectFaces('data:image/png;base64,' + base64Image);
            res.json(detections);
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/health', (req, res) => {
        res.json({ status: 'up' });
    });

    app.post('/mail', (req, res) => {
        let { mailOptions, key } = req.body;
        if (!mailOptions || !mailOptions.to || !mailOptions.subject || !mailOptions.text) {
            console.error('Missing mailOptions');
            return res.status(400).json({ error: 'Error: missing mailOptions. Expected mailOptions: { to, subject, text }' });
        }
        if (!EMAIL || !PASSWORD || !MAIL_KEY) {
            console.error('Missing email, password or mailKey');
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!key || key !== MAIL_KEY) {
            console.error('Invalid key');
            return res.status(401).json({ error: 'Invalid key' });
        }
        mailOptions.from = EMAIL;
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: 'Email sending failed'});
            }
            console.log('Email sent: ' + info.response);
            res.json({ status: 'ok', message: 'Email sent' });
        });
    });

    // Inicia el servidor
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port: ${PORT}`);
    });
}

main();