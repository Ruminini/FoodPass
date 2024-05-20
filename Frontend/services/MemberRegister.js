//import bcrypt from 'bcryptjs';
//import * as SQLite from 'expo-sqlite';

//const db = SQLite.openDatabase('FoodPass.db');

/**
 * Valida el formato y la existencia de un legajo en la base de datos.
 * @param {string} id - El código del legajo a validar.
 * @returns {Promise<boolean>} - Una promesa que indica si el legajo es válido y existe en la base de datos.
 *    Resuelve a true si el formato del legajo es válido y existe en la tabla de miembros válidos (valid_members),
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
 * Registrar o activar un miembro en la base de datos con la contraseña hasheada y otros datos necesarios.
 * @param {string} id - El código del miembro a registrar o activar.
 * @param {string} password - La contraseña del miembro a registrar o activar.
 * @returns {Promise<boolean>} - Una promesa que indica si la operación fue exitosa.
 *    Resuelve a true si el miembro se registró o activó correctamente en la base de datos, de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante el proceso.
 */
export async function insertMember(id, password) {
    // Validar el formato de la contraseña
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
        return Promise.resolve(false); // El formato de la contraseña es inválido
    }

    // Número de rondas para el salt
    const saltRounds = 10;

    try {
        // Generar el salt y hashear la contraseña
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed_pass = await bcrypt.hash(password, salt);
        const state = 'A';

        // Devolver una promesa que verifica e inserta/actualiza al miembro en la base de datos
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                // Verificar si el usuario ya existe en la base de datos
                tx.executeSql(
                    'SELECT * FROM user WHERE member_code = ?',
                    [id],
                    (_, { rows }) => {
                        if (rows.length === 0) {
                            // El usuario no está registrado, realizar el insert
                            tx.executeSql(
                                'INSERT INTO user (member_code, hashed_pass, salt, state) VALUES (?, ?, ?, ?)',
                                [id, hashed_pass, salt, state],
                                () => {
                                    resolve(true); // El miembro se registró con éxito
                                },
                                (_, error) => {
                                    console.error('Error al registrar el miembro:', error);
                                    reject(error);
                                }
                            );
                        } else {
                            // El usuario está registrado
                            const user = rows.item(0);
                            if (user.state === 'A') {
                                // El usuario ya está activo
                                resolve(false);
                            } else if (user.state === 'I') {
                                // El estado es 'I', actualizar a 'A'
                                tx.executeSql(
                                    'UPDATE user SET hashed_pass = ?, salt = ?, state = ? WHERE member_code = ?',
                                    [hashed_pass, salt, state, id],
                                    () => {
                                        resolve(true); // El miembro se activó correctamente
                                    },
                                    (_, error) => {
                                        console.error('Error al actualizar el miembro:', error);
                                        reject(error);
                                    }
                                );
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
