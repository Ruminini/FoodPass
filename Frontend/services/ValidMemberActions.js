import { getValidMemberById, 
  insertValidMember, 
  activeValidMember, 
  inactiveValidMember,
  getValidMembers,
  activeUserMember,
  inactiveUserMember,
  activeFaceMember,
  inactiveFaceMember
} from '../service_db/DBQuerys';

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
      // El miembro ya existe, lo activamos
      await activeValidMember(id);
      await activeUserMember(id);
      await activeFaceMember(id);

      console.log(`El miembro con ID ${id} ya existe. Se ha activado correctamente.`);
      const validMembers = await getValidMembers();
      console.log(validMembers)
      return true;
    } else {
      // El miembro no existe, lo insertamos
      await insertValidMember(id, name, last_name);
      console.log(`Nuevo miembro registrado con ID ${id}.`);
      const validMembers = await getValidMembers();
      console.log(validMembers)
      return true;
    }
  } catch (error) {
    console.error("Error al registrar miembro:", error);
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
      // El miembro existe, lo marcamos como inactivo
      await inactiveValidMember(id);
      await inactiveUserMember(id);
      await inactiveFaceMember(id);

      console.log(`El miembro con ID ${id} ha sido marcado como inactivo.`);
      
      const validMembers = await getValidMembers();
      console.log(validMembers)
      return true;
    } else {
      console.log(`El miembro con ID ${id} no existe.`);
      const validMembers = await getValidMembers();
      console.log(validMembers)
      return false;
    }
  } catch (error) {
    console.error("Error al eliminar miembro:", error);
    return false;
  }
}
