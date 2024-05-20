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
export function updatePasswordMember(id, oldPassword, newPassword) {
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
                    const userState = user.state;
                    const oldSalt = user.salt;
                    const oldHashedPass = user.hashed_pass;

                    if (userState === 'I') {
                        // Si el estado es 'I', el usuario está desactivado, resolver con false
                        resolve(false);
                        return;
                    }

                    // Verificar si la contraseña antigua es correcta
                    const isOldPasswordValid = bcrypt.compareSync(oldPassword + oldSalt, oldHashedPass);

                    if (!isOldPasswordValid) {
                        // Si la contraseña antigua no es válida, resolver con false
                        resolve(false);
                        return;
                    }   

                    const newHashedPass = bcrypt.hashSync(newPassword + oldSalt, 10);

                    // Verificar si la nueva contraseña es igual a la anterior
                    if (oldHashedPass === newHashedPass) {
                        // Si la nueva contraseña es igual a la anterior, resolver con false
                        resolve(false);
                        return;
                    }

                    // Actualizar la contraseña en la base de datos
                    tx.executeSql(
                        'UPDATE user SET hashed_pass = ? WHERE member_code = ?',
                        [newHashedPass, id],
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

                    // Verificar si la contraseña ingresada es correcta
                    const isPasswordValid = bcrypt.compareSync(password + storedSalt, storedHashedPass);

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
