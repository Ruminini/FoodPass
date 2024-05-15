//import * as SQLite from 'expo-sqlite';

// Crea o abre la base de datos SQLite
//const db = SQLite.openDatabase('');
//cerrar base de datos?
export function validateId(id) {
    return true;
    // Devolver una promesa que realiza la consulta a la base de datos
//    return new Promise((resolve, reject) => {
//        db.transaction(tx => {
//            tx.executeSql(
//                //'SELECT * FROM usuariosRegistrados WHERE id = ?',
//                [id],
//                (_, { rows }) => {
//                    // Si hay alguna fila devuelta, significa que el legajo está registrado
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
}

export function validatePassword(id, userPassword) {
    return true;
    //     Devolver una promesa que realiza la consulta a la base de datos
//    return new Promise((resolve, reject) => {
//        Verificar si el usuario ya tiene contraseña en la base de datos
//        db.transaction(tx => {
//            tx.executeSql(
//                'SELECT password FROM usuariosRegistrados WHERE id = ?',
//                [id],
//                (_, { rows }) => {
//                    El usuario no tiene contraseña, significa que no puede loguearse (aunque no haría falta fijarse)
//                    if (rows.length = 0) {
//                        resolve(false);
//                    }
//                    Si la contraseña del usuario es igual lo loguea sino le da error
//                    else if(rows.length > 0){
//                        let currentPassword = [...password];
//                        resolve(currentPassword !== userPassword);
//                    }
//                    resolve(true);               
//                },
//                (_, error) => {
//                    console.error('Error al ejecutar la consulta:', error);
//                    reject(error);
//                }
//            );
//        });
//    });
// }
}
