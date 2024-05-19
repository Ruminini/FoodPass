// import bcrypt from 'bcryptjs';
// import * as SQLite from 'expo-sqlite';

// // Abre la base de datos SQLite
// const db = SQLite.openDatabase('FoodPass.db');
// //cerrar base de datos?

// Este método devuelve una promesa true si se devuelven correctamente el id y la cara de los usuarios de la base de datos,
// en caso contrario devuelve falso. 
// export async function getFacesValidator() {
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

// Este método devuelve una promesa true si el usuario con ese id tiene la cuenta activa,
// en caso contrario devuelve falso. 
// export async function userStateValidator(id) {
//     // Devolver una promesa que realiza la consulta a la base de datos
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 'SELECT * FROM user WHERE member_code = ?',
//                  [id],
//                 (_, { users }) => {
//                     // Si se cumple la condición significa que el usuario está activo
//                     let user = users.item[0]
//                     resolve(user.state === 'A');
//                 },
//                 (_, error) => {
//                     console.error('Error al ejecutar la consulta:', error);
//                     reject(error);
//                 }
//             );
//         });
//     });
// }

// export async function validateId(id) {
//     // Devolver una promesa que realiza la consulta a la base de datos
//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 'SELECT * FROM user member_code = ?',
//                 [id],
//                 (_, { rows }) => {
//                     // Si hay alguna fila devuelta, significa que el legajo está registrado
//                     resolve(rows.length > 0);
//                 },
//                 (_, error) => {
//                     console.error('Error al ejecutar la consulta:', error);
//                     reject(error);
//                 }
//             );
//         });
//     });
// }

//  export async function validatePassword(id, user_password) {
//     try {
//         // Obtiene el salt para hashearlo con el password nuevo
//         const salt = takeSalt(id);
//         const hashed_new_pass = await bcrypt.hash(user_password, salt);
//         // Devolver una promesa que realiza la consulta a la base de datos
//         return new Promise((resolve, reject) => {
//             // Verificar si el usuario ya tiene contraseña en la base de datos
//             db.transaction(tx => {
//                 tx.executeSql(
//                     'SELECT * FROM user member_code = ?',
//                     [id],
//                     (_, { rows }) => {
//                         // Si la contraseña hasheada del usuario es igual a la ingresada también hasheada entonces lo loguea, sino le da error
//                         if(rows.length > 0){
//                             let user = rows.item[0]
//                             let current_hashed_pass = user.hashed_pass;
//                             resolve(bcrypt.compareSync(hashed_new_pass, current_hashed_pass));
//                             bcrypt.compareSync(oldPassword + oldSalt, oldHashedPass); Puede funcar este
//                         }            
//                     },
//                     (_, error) => {
//                         console.error('Error al ejecutar la consulta:', error);
//                         reject(error);
//                     }
//                 );
//             });
//         });
//     } catch (error) {
//         console.error('Error al generar el hash de la contraseña:', error);
//         return Promise.reject(error);
//     }
// }

//  export function takeSalt(id){
//     db.transaction(tx => {
//         tx.executeSql('SELECT * FROM user member_code = ?'), 
//         [id],
//         (_, { rows }) => {
//             // Si la contraseña del usuario es igual lo loguea sino le da error
//             let user = rows.item[0]
//             return salt = user.salt;        
//         },
//         (_, error) => {
//             console.error('Error al ejecutar la consulta:', error);
//             reject(error);
//         }
//     })
//  }
