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
