import {
  getAllDescriptors,
  getUserById,
  getTypeUserById,
  getPasswordById,
  getSaltById,
} from "../service_db/DBQuerys.jsx";
import { basicHash, compareHash } from "../utils/Hash.js";

// Este método devuelve true si se todas las caras de la base de datos,
// en caso contrario devuelve falso.
export async function getFacesValidator() {
  try {
    return getAllDescriptors();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Devuelve true si el id ingresado existe en user
export async function validateId(id) {
  let user = await getUserById(id);
  return user[0] !== undefined;
}

// Devuelve true si es un user admin
export async function validateTypeUser(id){
  let type_code = await getTypeUserById(id);
  return type_code === 1;
}

// Devuelve true si el password ingresado es el mismo que tiene en la db
export async function validatePassword(id, user_password) {
  //const salt = getSaltById(id);
  const user = await getUserById(id);
  return compareHash(user_password, user[0].salt, user[0].hashed_pass);
}

// Este método devuelve true si el usuario con ese id tiene la cuenta activa,
// en caso contrario devuelve falso.
export async function userStateValidator(id) {
  let user = await getUserById(id);
  return user[0].state === "A";
}

//  export async function validatePassword(id, user_password) {
//     try {
//         // Obtiene el salt para hashearlo con el password nuevo
//         const salt = takeSalt(id);
//         const hashed_new_pass = await bcrypt.hash(user_password, salt);
//         // Devolver una promesa que realiza la consulta a la base de datos
//         return new Promise((resolve, reject) => {
//             // Verificar si el usuario ya tiene contraseña en la base de datos
//             db.transaction(tx => {
//                 tx.executeSql(
//                     'SELECT * FROM user member_code = ?',
//                     [id],
//                     (_, { rows }) => {
//                         // Si la contraseña hasheada del usuario es igual a la ingresada también hasheada entonces lo loguea, sino le da error
//                         if(rows.length > 0){
//                             let user = rows.item[0]
//                             let current_hashed_pass = user.hashed_pass;
//                             resolve(bcrypt.compareSync(hashed_new_pass, current_hashed_pass));
//                             bcrypt.compareSync(oldPassword + oldSalt, oldHashedPass); Puede funcar este
//                         }
//                     },
//                     (_, error) => {
//                         console.error('Error al ejecutar la consulta:', error);
//                         reject(error);
//                     }
//                 );
//             });
//         });
//     } catch (error) {
//         console.error('Error al generar el hash de la contraseña:', error);
//         return Promise.reject(error);
//     }
// }

/* Obtener la contraseña hasheada del usuario por su id
  export const getPasswordById = (member_code) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM user member_code = ?",
          [member_code],
          (tx, results ) => {                
            const user = results.rows._array[0];
            let current_hashed_pass = user.hashed_pass; 
            resolve(current_hashed_pass);           
          },
          (tx, error) => {
            reject(error);
          }
        );
      });
    });
  };

// Obtener el salt de un usuario por su id
export const getSaltById = (member_code) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
        tx.executeSql(
        "SELECT * FROM user member_code = ?", 
        [member_code],
        (tx, results) => {
          const users = results.rows._array;
          console.log("funciono obtener salt");
          resolve(users[0]);       
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};
*/
