import { generateSalt, basicHash } from '../utils/Hash';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodPass.db');

/**
 * Valida el formato y la existencia de un legajo en la base de datos.
 * @param {string} id - El código del legajo a validar.
 * @returns {Promise<boolean>} - Una promesa que indica si el legajo es válido y existe en la base de datos.
 *    Resuelve a true si el formato del legajo es válido y existe en la tabla de miembros válidos (valid_member),
 *    de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */

export function validateIdMember(id) {
    // Verifica el formato del legajo
    if (!/^[0-9]{8}-[0-9]{4}$/.test(id)) {
        return Promise.resolve(false);
    }

    // Devolver una promesa que realiza la consulta a la base de datos
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM valid_member WHERE code = ?',
                [id],
                (_, { rows }) => {
                    // Si hay alguna fila devuelta, significa que el legajo existe
                    resolve(rows.length > 0);
                },
                (_, error) => {
                    console.error('Error al ejecutar la consulta:', error);
                    reject(error);
                }
            );
        });
    });
}

export async function insertMember(id, password) {
    // Validar el formato de la contraseña
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
        return Promise.resolve(false); // El formato de la contraseña es inválido
    }

    try {
        // Generar el salt de manera segura usando el método importado generateSalt
        const salt = generateSalt();

        // Generar el hash de la contraseña con el salt usando el método importado basicHash
        const hashed_pass = basicHash(password, salt);

        // Realizar la inserción o actualización en la base de datos
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM user WHERE member_code = ?',
                    [id],
                    (_, { rows }) => {
                        if (rows.length === 0) {
                            tx.executeSql(
                                "INSERT OR IGNORE INTO user (member_code, type_code, hashed_pass, salt, create_date, last_update, state) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                [
                                    id,
                                    2,
                                    hashed_pass,
                                    salt,
                                    new Date().toString(),
                                    new Date().toString(),
                                    "A",
                                ],
                                () => {
                                    // Verificar si el usuario se ha registrado correctamente
                                    tx.executeSql(
                                        'SELECT * FROM user WHERE member_code = ?',
                                        [id],
                                        (_, { rows }) => {
                                            if (rows.length > 0) {
                                                resolve(true); // El miembro se registró con éxito
                                            } else {
                                                resolve(false); // El registro falló
                                            }
                                        },
                                        (_, error) => {
                                            console.error('Error al verificar el registro del miembro:', error);
                                            reject(error);
                                        }
                                    );
                                },
                                (_, error) => {
                                    console.error('Error al registrar el miembro:', error);
                                    reject(error);
                                }
                            );
                        } else {
                            // El usuario ya existe
                            const user = rows.item(0);
                            if (user.state === 'I') {
                                // Actualizar el estado a 'A' y la contraseña
                                tx.executeSql(
                                    'UPDATE user SET hashed_pass = ?, salt = ?, create_date = ?, last_update = ?, state = ? WHERE member_code = ?',
                                    [
                                        hashed_pass, 
                                        salt,
                                        new Date().toString(),
                                        new Date().toString(),
                                        "A",
                                        id,
                                    ],
                                    () => {
                                        resolve(true); // El estado se actualizó y la contraseña se cambió con éxito
                                    },
                                    (_, error) => {
                                        console.error('Error al actualizar el estado y la contraseña:', error);
                                        reject(error);
                                    }
                                );
                            } else {
                                resolve(false); // El usuario ya está activo, no es necesario actualizar
                            }
                        }
                    },
                    (_, error) => {
                        console.error('Error al verificar el miembro:', error);
                        reject(error);
                    }
                );
            });
        });
    } catch (error) {
        console.error('Error al generar el hash de la contraseña:', error);
        return Promise.reject(error);
    }
}
