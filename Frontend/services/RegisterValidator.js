import bcrypt from 'bcryptjs';
//const bcrypt = require('bcryptjs');

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodPass.db');

/**
 * Valida el formato y la existencia de un legajo en la base de datos.
 * @param {string} id - El código del legajo a validar.
 * @returns {Promise<boolean>} - Una promesa que indica si el legajo es válido y existe en la base de datos.
 *    Resuelve a true si el formato del legajo es válido y existe en la tabla de miembros válidos (valid_members),
 *    de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */

export function validateId(id) {
    // Verifica el formato del legajo
    if (!/^[0-9]{8}-[0-9]{4}$/.test(id)) {
        return Promise.resolve(false);
    }

    // Devolver una promesa que realiza la consulta a la base de datos
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM valid_members WHERE code_text = ?',
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

/**
 * Valida la contraseña del usuario.
 * @param {string} id - El código del miembro o identificador del usuario.
 * @param {string} password - La contraseña a validar.
 * @returns {Promise<boolean>} - Una promesa que indica si la contraseña es válida o no.
 *    Resuelve a true si la contraseña es válida y el usuario no está registrado en la base de datos,
 *    o si la contraseña es válida y el usuario no tiene una contraseña registrada en la base de datos.
 *    Resuelve a false si el formato de la contraseña es inválido o si el usuario ya tiene una contraseña registrada.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */

export function validatePassword(id, password) {
    // Validar el formato de la contraseña
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
        return Promise.resolve(false); // El formato de la contraseña es inválido
    }

    // Devolver una promesa que realiza la consulta a la base de datos
    return new Promise((resolve, reject) => {
        // Verificar si el usuario ya tiene contraseña en la base de datos
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM user WHERE member_code = ?',
                [id],
                (_, { rows }) => {
                    // Si no hay filas devueltas, significa que el usuario no está registrado
                    if (rows.length === 0) {
                        resolve(true);
                    } else {
                        // Si hay alguna fila devuelta y hashed_pass no es NULL, el usuario ya tiene una contraseña
                        const user = rows.item(0);
                        resolve(!user.hashed_pass);
                    }
                },
                (_, error) => {
                    console.error('Error al ejecutar la consulta:', error);
                    reject(error);
                }
            );
        });
    });
}


/**
 * Registra un nuevo miembro en la base de datos con la contraseña hasheada y otros datos necesarios.
 * @param {string} id - El código del miembro a registrar.
 * @param {string} password - La contraseña del miembro a registrar.
 * @returns {Promise<boolean>} - Una promesa que indica si el registro fue exitoso.
 *    Resuelve a true si el miembro se registró correctamente en la base de datos, de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante el proceso de registro.
 */

export async function registerMember(id, password) {
    // Número de rondas para el salt
    const saltRounds = 10;

    try {
        // Generar el salt y hashear la contraseña
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed_pass = await bcrypt.hash(password, salt);
        const state = 'A';

        // Devolver una promesa que inserta el nuevo miembro en la base de datos
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO user (member_code, hashed_pass, salt, state) VALUES (?, ?, ?, ?)',
                    [id, hashed_pass, salt, state],
                    () => {
                        // El miembro se registró con éxito
                        resolve(true);
                    },
                    (_, error) => {
                        console.error('Error al registrar el miembro:', error);
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
