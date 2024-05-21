import Toast from 'react-native-toast-message';
import { generateSalt, basicHash, compareHash } from '../utils/Hash';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodPass.db');

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
export function updatePasswordMember(id, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT member_code, state, hashed_pass, salt FROM user WHERE member_code = ?',
                [id],
                async (_, { rows }) => {
                    if (rows.length === 0) {
                        resolve(false); // Si no se encuentra el usuario, resolver con false
                        Toast.show({
                            type: 'error',
                            text1: 'Miembro inexistente',
                        })
                        return;
                    }

                    const user = rows._array[0];
                    const userState = user.state;
                    const oldSalt = user.salt;
                    const oldHashedPass = user.hashed_pass;

                    if (userState === 'I') {
                        resolve(false); // Si el estado es 'I', el usuario está desactivado, resolver con false
                        Toast.show({
                            type: 'error',
                            text1: 'Miembro inactivo',
                        })
                        return;
                    }

                    // Verificar si la contraseña antigua es correcta utilizando compareHash
                    const isOldPasswordValid = compareHash(oldPassword, oldSalt, oldHashedPass);

                    if (!isOldPasswordValid) {
                        resolve(false); // Si la contraseña antigua no es válida, resolver con false
                        Toast.show({
                            type: 'error',
                            text1: 'Contraseña incorrecta.',
                        })
                        return;
                    }

                    // Generar una nueva salt
                    const newSalt = generateSalt();

                    // Generar el hash de la nueva contraseña con la nueva salt
                    const newHashedPass = basicHash(newPassword, newSalt);

                    // Actualizar la contraseña en la base de datos
                    tx.executeSql(
                        'UPDATE user SET hashed_pass = ?, salt = ? WHERE member_code = ?',
                        [newHashedPass, newSalt, id],
                        () => {
                            resolve(true); // Si la actualización es exitosa, resolver con true
                            Toast.show({
                                type: 'success',
                                text1: 'Contraseña actualizada.',
                            })
                        },
                        (_, error) => {
                            Toast.show({
                                type: 'error',
                                text1: 'Error al actualizar la contraseña.',
                                text2: error.message,
                            })
                            reject(error);
                        }
                    );
                },
                (_, error) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Error al actualizar la contraseña.',
                        text2: error.message,
                    })
                    reject(error);
                }
            );
        });
    });
}


/**
 * Desactiva un miembro en la tabla user si el legajo y la contraseña coinciden.
 * @param {string} id - El código del legajo del miembro.
 * @param {string} password - La contraseña del miembro.
 * @returns {Promise<boolean>} - Una promesa que indica si el miembro fue desactivado correctamente.
 *    Resuelve a true si el miembro se desactivó correctamente, de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */
export function desactiveMember(id, password) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT state, hashed_pass, salt FROM user WHERE member_code = ?',
                [id],
                async (_, { rows }) => {
                    if (rows.length === 0) {
                        // Si no se encuentra el usuario, resolver con false
                        resolve(false);
                        return;
                    }

                    const user = rows._array[0];
                    const storedState = user.state;
                    const storedSalt = user.salt;
                    const storedHashedPass = user.hashed_pass;

                    if (storedState === 'I') {
                        // Si el estado es 'I', el miembro ya está desactivado, resolver con false
                        resolve(false);
                        return;
                    }

                    // Verificar si la contraseña antigua es correcta utilizando compareHash
                    const isPasswordValid = compareHash(password, storedSalt, storedHashedPass)

                    if (!isPasswordValid) {
                        // Si la contraseña ingresada no es válida, resolver con false
                        resolve(false);
                        return;
                    }

                    // Desactivar el miembro actualizando el estado a 'I'
                    tx.executeSql(
                        'UPDATE user SET state = ? WHERE member_code = ?',
                        ['I', id],
                        () => {
                            // Si la actualización es exitosa, resolver con true
                            resolve(true);
                        },
                        (_, error) => {
                            console.error('Error al ejecutar la actualización:', error);
                            reject(error);
                        }
                    );
                },
                (_, error) => {
                    console.error('Error al ejecutar la consulta:', error);
                    reject(error);
                }
            );
        });
    });
}
