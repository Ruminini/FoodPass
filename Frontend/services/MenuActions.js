import { getTotalDataFoodByName,

    inactiveFood
  } from '../service_db/DBQuerys';

/**
 * Decide qué acción realizar en base a una acción dada.
 * @param {string} action - La acción a decidir.
 * @returns {void}
 */
export async function decideAction(action, name, category, type, description, stock, pointReOrder) {
    switch (action) {
      case 'Alta':
        return handleLoud(name, category, type, description, stock, pointReOrder);
      case 'Baja':
        return handleDown(name);
      case 'Actualización de stock':
        return handleUpdateStock(name, stock);
      default:
        console.log(`Acción no reconocida: ${action}`);
        return false;
    }
}

function handleLoud(name, category, type, description, stock, pointReOrder) {
console.log('Realizando acción de alta...');
// Lógica para el alta
}

/**
 * Realiza la acción de dar de baja un alimento.
 * @param {string} name - El nombre del alimento a dar de baja.
 * @returns {Promise<{ success: boolean, message: string }>} - Una promesa que resuelve con un objeto que contiene el resultado de la acción y un mensaje descriptivo.
 */
async function handleDown(name) {
    try {
      console.log('Realizando acción de baja...');
      const food = await getTotalDataFoodByName(name);
      if (food[0] !== undefined) {
        await inactiveFood(name);
        return { success: true, message: `El alimento ${name} ha sido dado de baja.` };
      } else {
        return { success: false, message: `No se encontró el alimento ${name}.` };
      }
    } catch (error) {
      console.error(`Error al dar de baja el alimento ${name}:`, error);
      return { success: false, message: `Error al dar de baja el alimento ${name}: ${error.message}` };
    }
  }

function handleUpdateStock(name, stock) {
console.log('Realizando acción de actualización de stock...');
// Lógica para la actualización de stock
}
