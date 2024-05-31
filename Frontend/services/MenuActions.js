import { getTotalDataFoodByName,
    inactiveFoodByName,
    updateStockFoodByName
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
      if (food[0].state === 'I') { // Verificar si el producto ya está dado de baja
        return { error: false, message: `${name} ya está dado de baja.` };
      }

      // Si el producto no está dado de baja, proceder con la acción
      await inactiveFoodByName(name);
      return { success: true, message: `${name} ha sido dado de baja.` };
    } else {
      return { success: false, message: `No se encontró ${name}.` };
    }
  } catch (error) {
    console.error(`Error al dar de baja ${name}:`, error);
    return { success: false, message: `Error al dar de baja ${name}` };
  }
}

/**
 * Realiza la acción de actualizar el stock de un alimento.
 * @param {string} name - El nombre del alimento.
 * @param {number} stock - La cantidad de stock a actualizar.
 * @returns {Promise<{ success: boolean, message: string }>} - Una promesa que resuelve con un objeto que contiene el resultado de la acción y un mensaje descriptivo.
 */
async function handleUpdateStock(name, stock) {
  try {
    console.log('Realizando acción de actualización de stock...');
    const food = await getTotalDataFoodByName(name);

    if (food[0] !== undefined) {
      if (food[0].state === 'I') { // Verificar si el producto ya está dado de baja
        return { error: false, message: `${name} está dado de baja.` };
      }

      const old_stock = parseInt(food[0].stock, 10); // Convertir a entero
      const new_stock = old_stock + parseInt(stock, 10); // Convertir a entero y sumar

      // Si el producto no está dado de baja, proceder con la acción
      await updateStockFoodByName(name, new_stock); // Actualizar el stock con el nuevo valor
      return { success: true, message: `El stock de ${name} ha sido actualizado.` };
    } else {
      return { success: false, message: `No se encontró ${name}.` };
    }
  } catch (error) {
    console.error(`Error al actualizar stock de ${name}:`, error);
    return { success: false, message: `Error al actualizar stock de ${name}` };
  }
}
