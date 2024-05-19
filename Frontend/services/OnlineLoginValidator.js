// import * as SQLite from 'expo-sqlite';

// // Abre la base de datos SQLite
// const db = SQLite.openDatabase('FoodPass.db');
// //cerrar base de datos?

// Este método devuelve una promesa true si se devuelven correctamente el id y la cara de los usuarios de la base de datos,
// en caso contrario devuelve falso. 
export async function getFacesValidator(descriptor) {
    return new Promise(true);
//     // Devolver una promesa que realiza la consulta a la base de datos
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 'SELECT id, descriptor FROM face',
//                 (_, { rows: {descriptores} }) => {
//                     // Devuelve los descriptores a comparar. 
//                     resolve(descriptores);
//                 },
//                 (_, error) => {
//                     console.error('Error al ejecutar la consulta:', error);
//                     reject(error);
//                 }
//             );
//         });
//     });
}


// function euclideanDistance(vector1, vector2) {
// 	if (vector1.length !== vector2.length) {
// 		throw new Error('Vectors must be of the same length');
// 	}
// 	let sumOfSquares = 0;
// 	for (let i = 0; i < vector1.length; i++) {
// 		const difference = vector1[i] - vector2[i];
// 		sumOfSquares += difference * difference;
// 	}
// 	return Math.sqrt(sumOfSquares);
// }

// // Esta función debería reemplazar la que se encuentra en FaceScan.js!!
// // Función para matchear los descriptores de los rostros de las personas a partir de su distancia euclideana, si es menor a ??? la distancia entonces son la misma persona.
// // Por cada descriptor busco el que esté más cerca en la distancia euclideana. Si no hay ninguno significa que esa persona no está registrada.
// export async function matchFaces(descriptor_from_login) {
//     try {
//         const faces = await getFacesValidator();
//         let closestFace = null;
//         let closestDistance = Infinity;
//         faces.forEach(face => {
//             const descriptor_from_db = JSON.parse(face.descriptor);
//             const distance = euclideanDistance(descriptor_from_login, descriptor_from_db);
//             if (distance < closestDistance) {
//                 closestFace = face;
//                 closestDistance = distance;
//             }
//         });
//         console.log(`Persona más cercana: ${closestFace}, distancia: ${closestDistance}`);
//     } catch (error) {
//         console.error('Error al encontrar el descriptor más cercano:', error);
//         throw error;
//     }    
// }