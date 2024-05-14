//import * as SQLite from 'expo-sqlite';

// Crea o abre la base de datos SQLite
//const db = SQLite.openDatabase('');

export function validateId(id) {
    // Verifica el formato del legajo
    if (!/^[0-9]{8}-[0-9]{4}$/.test(id)) {
        return Promise.resolve(false); // El formato del legajo es inválido
    }
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}
    // Devolver una promesa que realiza la consulta a la base de datos
//    return new Promise((resolve, reject) => {
//        db.transaction(tx => {
//            tx.executeSql(
//                //'SELECT * FROM usuarios WHERE legajo = ?',
//                [id],
//                (_, { rows }) => {
//                    // Si hay alguna fila devuelta, significa que el legajo existe
//                    resolve(rows.length > 0);
//                },
//                (_, error) => {
//                    console.error('Error al ejecutar la consulta:', error);
//                    reject(error);
//                }
//            );
//        });
//    });
//}

export function validatePassword(id, password) {
    // Validar el formato del contraseña
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
        return Promise.resolve(false); // El formato de la contraseña es inválido
    }
    return new Promise((resolve, reject) => {
        resolve(true);
    });
}
    // Devolver una promesa que realiza la consulta a la base de datos
//    return new Promise((resolve, reject) => {
//        // Verificar si el usuario ya tiene contraseña en la base de datos
//        db.transaction(tx => {
//            tx.executeSql(
//                //'SELECT * FROM usuarios WHERE id = ? AND password IS NOT NULL',
//                [id],
//                (_, { rows }) => {
//                    // El usuario ya tiene contraseña, significa que no puede registrarse
//                    if (rows.length > 0) {
//                        resolve(false);
//                    }
//                },
//                (_, error) => {
//                    console.error('Error al ejecutar la consulta:', error);
//                    reject(error);
//                }
//            );
//        });
//    });
//}

export function registerPassword(id, password) {
    return new Promise((resolve, reject) => {
        resolve(false);
    });
}
    // Devolver una promesa que actualiza la contraseña en la base de datos
//    return new Promise((resolve, reject) => {
//        // Realizar la actualización en la base de datos
//        db.transaction(tx => {
//            tx.executeSql(
//                //'UPDATE usuarios SET password = ? WHERE id = ?',
//                [password, id],
//                () => {
//                    // La contraseña se actualizó con éxito
//                    resolve(true);
//                },
//                (_, error) => {
//                    console.error('Error al actualizar la contraseña:', error);
//                    reject(error);
//                }
//            );
//        });
//    });
//}
