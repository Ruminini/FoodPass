// import * as SQLite from 'expo-sqlite';

// // Abre la base de datos SQLite
// const db = SQLite.openDatabase('FoodPass.db');
// //cerrar base de datos?

// Este método devuelve una promesa true si se devuelven correctamente el id y la cara de los usuarios de la base de datos,
// en caso contrario devuelve falso. 
// export async function getFacesValidator(descriptor) {
//     return new Promise(true);
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
// }