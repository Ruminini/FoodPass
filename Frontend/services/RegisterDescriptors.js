import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('FoodPass.db');

/**
 * Inserta un nuevo registro en la tabla de caras (faces) de la base de datos.
 * @param {string} id - El código del legajo asociado a la cara.
 * @param {Array} descriptor - Los descriptores de la cara.
 * @returns {Promise<boolean>} - Una promesa que indica si el registro se insertó correctamente.
 *    Resuelve a true si el registro se insertó correctamente, de lo contrario, resuelve a false.
 *    Rechaza la promesa si ocurre algún error durante la ejecución de la consulta a la base de datos.
 */
export function insertFaceDescriptors(id, descriptor) {
    // Devolver una promesa que realiza la inserción en la base de datos
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'INSERT INTO faces (id, descriptor, state) VALUES (?, ?, ?)',
                [id, JSON.stringify(descriptor), 'A'], // Se asume que el estado es 'A' para activo
                (_, result) => {
                    // Verificar si se insertó correctamente al menos una fila
                    if (result.rowsAffected > 0) {
                        resolve(true); // Resuelve a true si se insertó correctamente
                    } else {
                        resolve(false); // Resuelve a false si no se insertó ninguna fila (posiblemente debido a un error)
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
