import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodPass.db');

/**
 * Inserta o actualiza un registro en la tabla de caras (faces) de la base de datos.
 * @param {string} id - El código del legajo asociado a la cara.
 * @param {Array} descriptors - Los descriptores de la cara.
 * @returns {Promise<boolean>} - Una promesa que indica si la operación se realizó correctamente.
 *    Resuelve a true si la operación se realizó correctamente, de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */
export function insertFaceDescriptorsMember(id, descriptors) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // Verificar si el id se encuentra en la tabla faces
            tx.executeSql(
                'SELECT * FROM faces WHERE id = ?',
                [id],
                (_, { rows }) => {
                    if (rows.length === 0) {
                        // No se encontró el id, realizar la inserción
                        tx.executeSql(
                            'INSERT INTO faces (id, descriptors, state) VALUES (?, ?, ?)',
                            [id, JSON.stringify(descriptors), 'A'],
                            (_, result) => {
                                if (result.rowsAffected > 0) {
                                    resolve(true); // Registro insertado correctamente
                                } else {
                                    resolve(false); // No se insertó ninguna fila
                                }
                            },
                            (_, error) => {
                                console.error('Error al ejecutar la consulta de inserción:', error);
                                reject(error);
                            }
                        );
                    } else {
                        // Se encontró el id, realizar la actualización
                        tx.executeSql(
                            'UPDATE faces SET descriptors = ?, state = ? WHERE id = ?',
                            [JSON.stringify(descriptors), 'A', id],
                            (_, result) => {
                                if (result.rowsAffected > 0) {
                                    resolve(true); // Registro actualizado correctamente
                                } else {
                                    resolve(false); // No se actualizó ninguna fila
                                }
                            },
                            (_, error) => {
                                console.error('Error al ejecutar la consulta de actualización:', error);
                                reject(error);
                            }
                        );
                    }
                },
                (_, error) => {
                    console.error('Error al verificar la existencia del id:', error);
                    reject(error);
                }
            );
        });
    });
}
