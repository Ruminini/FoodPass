import { getValidMemberById,
  getUserById,
  getDescriptorsById,
  insertValidMember,
  activeValidMember,
  inactiveValidMember,
  activeUserMember,
  inactiveUserMember,
  activeFaceMember,
  inactiveFaceMember
} from '../service_db/DBQuerys';

import Toast from 'react-native-toast-message';

/**
 * Obtiene información relevante de un miembro dado su ID.
 * 
 * @param {string} id - El ID del miembro del cual se desea obtener información.
 * @returns {Promise<void>} - Una promesa que resuelve sin un valor concreto una vez que se completa la obtención de información.
 */
const fetchMemberData = async (id) => {
  try {
    // Obtener información del miembro válido
    const validMember = await getValidMemberById(id);
    console.log(validMember);

    // Obtener información del usuario por ID
    const userMember = await getUserById(id);
    console.log(userMember);

    // Obtener descriptores faciales por ID
    const faceMember = await getDescriptorsById(id);
    console.log(faceMember);
  } catch (error) {
    console.error("Error al obtener datos del miembro:", error);
  }
};

/**
 * Registra un miembro válido.
 * Si el miembro ya existe, lo activa; de lo contrario, lo inserta.
 * @param {string} id - El ID del miembro.
 * @param {string} name - El nombre del miembro.
 * @param {string} last_name - El apellido del miembro.
 * @returns {Promise<boolean>} Una promesa que se resuelve con true si se registra correctamente, false si hay algún error.
 */
export async function validMemberRegister(id, name, last_name) {
  try {
    const existingMember = await getValidMemberById(id);
    if (existingMember.length > 0) {
      if (existingMember[0].state === 'A') {
        Toast.show({
          type: 'error',
          text1: `El miembro con ID ${id} ya está activo.`,
        });
        return false;
      }
      // El miembro ya existe, lo activamos
      await activeValidMember(id);
      await activeUserMember(id);
      await activeFaceMember(id);

      Toast.show({
        type: 'success',
        text1: `El miembro con ID ${id} se ha activado correctamente.`,
      });
      fetchMemberData(id);
      return true;
    } else {
      // El miembro no existe, lo insertamos
      await insertValidMember(id, name, last_name);
      Toast.show({
        type: 'success',
        text1: `Nuevo miembro registrado con ID ${id}.`,
      });
      fetchMemberData(id);
      return true;
    }
  } catch (error) {
    console.error("Error al registrar miembro:", error);
    Toast.show({
      type: 'error',
      text1: 'Error al registrar miembro. Por favor, inténtalo de nuevo.',
    });
    return false;
  }
}

/**
 * Elimina un miembro válido.
 * Si el miembro existe, lo marca como inactivo; de lo contrario, no hace nada.
 * @param {string} id - El ID del miembro.
 * @returns {Promise<boolean>} Una promesa que se resuelve con true si se elimina correctamente, false si hay algún error.
 */
export async function validMemberDelete(id) {
  try {
    const existingMember = await getValidMemberById(id);
    if (existingMember.length > 0) {
      if (existingMember[0].state === 'I') {
        Toast.show({
          type: 'error',
          text1: `El miembro con ID ${id} ya está inactivo.`,
        });
        return false;
      }
      // El miembro existe, lo marcamos como inactivo
      await inactiveValidMember(id);
      await inactiveUserMember(id);
      await inactiveFaceMember(id);

      Toast.show({
        type: 'success',
        text1: `El miembro con ID ${id} ha sido marcado como inactivo.`,
      });
      fetchMemberData(id);
      return true;
    } else {
      Toast.show({
        type: 'error',
        text1: `El miembro con ID ${id} no existe.`,
      });
      fetchMemberData(id);
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar miembro:", error);
    Toast.show({
      type: 'error',
      text1: 'Error al eliminar miembro. Por favor, inténtalo de nuevo.',
    });
    return false;
  }
}
