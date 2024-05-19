//import bcrypt from 'bcryptjs';
//import * as SQLite from 'expo-sqlite';

//const db = SQLite.openDatabase('FoodPass.db');

/**
 * Actualiza la contraseña de un usuario si la contraseña actual es correcta.
 * @param {string} id - El código del legajo del usuario.
 * @param {string} newPassword - La nueva contraseña del usuario.
 * @param {string} oldPassword - La contraseña actual del usuario.
 * @returns {Promise<boolean>} - Una promesa que indica si la contraseña fue actualizada correctamente.
 *    Resuelve a true si la contraseña fue actualizada exitosamente,
 *    de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */
//export function insertNewPassword(id, oldPassword, newPassword) {
//    return new Promise((resolve, reject) => {
//        db.transaction(tx => {
//            tx.executeSql(
//                'SELECT hashed_pass, salt FROM user WHERE member_code = ?',
//                [id],
//                async (_, { rows }) => {
//                    if (rows.length === 0) {
//                        // Si no se encuentra el usuario, resolver con false
//                        resolve(false);
//                        return;
//                    }
//
//                    const user = rows._array[0];
//                    const oldSalt = user.salt;
//                    const oldHashedPass = user.hashed_pass;
//
//                    // Verificar si la contraseña antigua es correcta
//                    const isOldPasswordValid = bcrypt.compareSync(oldPassword + oldSalt, oldHashedPass);
//
//                    if (!isOldPasswordValid) {
//                        // Si la contraseña antigua no es válida, resolver con false
//                        resolve(false);
//                        return;
//                    }
//
//                    // Generar nuevo salt y hash para la nueva contraseña
//                    const newSalt = bcrypt.genSaltSync(10);
//                    const newHashedPass = bcrypt.hashSync(newPassword + newSalt, 10);
//
//                    // Verificar si la nueva contraseña es igual a la anterior
//                    if (oldHashedPass === newHashedPass) {
//                        // Si la nueva contraseña es igual a la anterior, resolver con false
//                        resolve(false);
//                        return;
//                    }
//
//                    // Actualizar la contraseña y el salt en la base de datos
//                    tx.executeSql(
//                        'UPDATE user SET hashed_pass = ?, salt = ? WHERE member_code = ?',
//                        [newHashedPass, newSalt, id],
//                        () => {
//                            // Si la actualización es exitosa, resolver con true
//                            resolve(true);
//                        },
//                        (_, error) => {
//                            console.error('Error al ejecutar la actualización:', error);
//                            reject(error);
//                        }
//                    );
//                },
//                (_, error) => {
//                    console.error('Error al ejecutar la consulta:', error);
//                    reject(error);
//                }
//            );
//        });
//    });
//}
//