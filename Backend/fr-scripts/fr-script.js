const MODEL_URL = '/Backend/models';

(async () => {

    //carga de modelos
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
    await faceapi.loadFaceLandmarkModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)

    //identificación de plantillas del HTML
    const faces = document.getElementById('image');
    const canvas = document.getElementById('canvas');

    //carga de la cara a identificar
    const refFace = await faceapi.fetchImage('/Backend/images/aaron.jpeg')

    canvas.width = faces.width;
    canvas.height = faces.height;

    //carga de los datos de la cara a comparar
    let refFaceAiData = await faceapi.detectAllFaces(refFace)
        .withFaceLandmarks()
        .withFaceDescriptors()

    //carga de los datos de la caras a comparar con la original
    let facesToCheckAiData = await faceapi.detectAllFaces(faces)
        .withFaceLandmarks()
        .withFaceDescriptors()

    faceapi.matchDimensions(canvas, faces)
    let faceMatcher = new faceapi.FaceMatcher(refFaceAiData)
    facesToCheckAiData = faceapi.resizeResults(facesToCheckAiData, faces)
    
    //para cada cara buscar la que mayor coincida con la original
    facesToCheckAiData.forEach(face=>{
        const {detection, descriptor} = face
        let label = faceMatcher.findBestMatch(descriptor).toString()
        if(label.includes("unknown")){
            return
        }
        console.log(face)
        //crea el recuedro con la cara conocida si está en la imagen
        let options = {label: "Aaron Paul"}
        const drawBox = new faceapi.draw.DrawBox(detection.box, options)
        drawBox.draw(canvas)
    })

})();