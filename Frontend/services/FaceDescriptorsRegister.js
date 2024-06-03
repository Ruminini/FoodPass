import { matchFaces } from '../services/FaceMatcher.js';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodPass.db');

/**
 * Valida los descriptores faciales de un miembro.
 * @param {Array} descriptors - Descriptores faciales del miembro a validar.
 * @returns {Promise<boolean>} - Promesa que resuelve con un valor booleano indicando si la validación fue exitosa.
 */
export async function validFaceDescriptorsMember(descriptors) {
    try {
        // Encuentra la persona más cercana que coincide con los descriptores faciales
        const closest = await matchFaces(descriptors);

        // Comprueba si se encontró una coincidencia y si la distancia es aceptable
        if (!closest || !closest.person || closest.distance > 0.50) {
            // Si no se encontró una coincidencia o la distancia es demasiado alta, devuelve verdadero
            return true;
        } else {
            // Si la distancia está entre los umbrales aceptables, devuelve verdadero
            return false;
        }
    } catch (error) {
        // Maneja cualquier error que ocurra durante el proceso de validación
        console.error('Error al validar descriptores faciales de miembro:', error);
        // Devuelve falso en caso de error
        return false;
    }
}

/**
 * Inserta o actualiza un registro en la tabla de caras (face) de la base de datos.
 * @param {string} id - El código del legajo asociado a la cara.
 * @param {Array} descriptors - Los descriptores de la cara.
 * @returns {Promise<object>} - Una promesa que resuelve a un objeto con la información del registro insertado o actualizado.
 *    Si la operación se realizó correctamente, el objeto contendrá los descriptores y otros detalles del registro.
 *    Si ocurre un error durante la ejecución de la consulta a la base de datos, la promesa será rechazada con el error.
 */
export function insertFaceDescriptorsMember(id, descriptors) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // Verificar si el id se encuentra en la tabla face
            tx.executeSql(
                'SELECT * FROM face WHERE user_id = ?',
                [id],
                (_, { rows }) => {
                    console.log(rows.length)
                    if (rows.length === 0) {
                        // No se encontró el id, realizar la inserción
                        tx.executeSql(
                            "INSERT OR IGNORE INTO face (user_id, descriptor, create_date, state) VALUES (?, ?, ?, ?)",
                            [
                                id, 
                                JSON.stringify(descriptors), 
                                new Date().toString(), 
                                "A"
                            ],
                            (_, result) => {
                                console.log(result)
                                if (result.rowsAffected > 0) {
                                    // Obtener el registro insertado
                                    tx.executeSql(
                                        'SELECT * FROM face WHERE user_id = ?',
                                        [id],
                                        (_, { rows }) => {
                                            resolve(rows._array[0]); // Resolver con el registro insertado
                                        },
                                        (_, error) => {
                                            console.error('Error al obtener el registro insertado:', error);
                                            reject(error);
                                        }
                                    );
                                } else {
                                    resolve(null); // No se insertó ninguna fila
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
                            'UPDATE face SET descriptor = ?, state = ?, create_date = ? WHERE user_id = ?',
                            [
                                JSON.stringify(descriptors), 
                                'A',
                                new Date().toString(), 
                                id
                            ],
                            (_, result) => {
                                if (result.rowsAffected > 0) {
                                    // Obtener el registro actualizado
                                    tx.executeSql(
                                        'SELECT * FROM face WHERE user_id = ?',
                                        [id],
                                        (_, { rows }) => {
                                            resolve(rows._array[0]); // Resolver con el registro actualizado
                                        },
                                        (_, error) => {
                                            console.error('Error al obtener el registro actualizado:', error);
                                            reject(error);
                                        }
                                    );
                                } else {
                                    resolve(null); // No se actualizó ninguna fila
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
