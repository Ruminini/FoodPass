import { getTotalDataFoodByName, 
    insertFood, 
    activeFoodByName, 
    inactiveFoodByName, 
    updateStockFoodByName } from '../service_db/DBQuerys';

/**
 * Decide qué acción realizar en base a la acción proporcionada.
 * @param {string} action - La acción a realizar ('Alta', 'Baja', 'Actualización de stock').
 * @param {string} name - Nombre del producto.
 * @param {string} category - Categoría del producto ('Comida', 'Bebida', 'Postre').
 * @param {string} type - Tipo del producto (opcional: 'Vegano', 'Vegetariano', 'Celiaco').
 * @param {string} description - Descripción del producto.
 * @param {number} stock - Stock disponible del producto.
 * @param {number} pointReOrder - Punto de reorden del producto.
 * @returns {Object} Objeto con el resultado de la operación.
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

/**
 * Maneja la acción de alta de un producto en la base de datos.
 * @param {string} name - Nombre del producto.
 * @param {string} category - Categoría del producto ('Comida', 'Bebida', 'Postre').
 * @param {string} type - Tipo del producto (opcional: 'Vegano', 'Vegetariano', 'Celiaco').
 * @param {string} description - Descripción del producto.
 * @param {number} stock - Stock disponible del producto.
 * @param {number} pointReOrder - Punto de reorden del producto.
 * @returns {Object} Objeto con el resultado de la operación.
 */
async function handleLoud(name, category, type, description, stock, pointReOrder) {
  try {
    console.log('Realizando acción de alta...');
    const food = await getTotalDataFoodByName(name);

    if (food[0] !== undefined) {
      if (food[0].state === 'A') { // Verificar si el producto ya está dado de alta
        return { success: false, message: `${name} ya está cargado.` };
      } else if (food[0].state === 'I') {
        await activeFoodByName(name); 
        return { success: true, message: `${name} se activó nuevamente.` };
      }
    } else {
      let code_category = 0;
      let code_type = 0;

      // Asignar código de categoría según la categoría ingresada
      if (category === 'Comida') {
        code_category = 1;
      } else if (category === 'Bebida') {
        code_category = 2;
      } else if (category === 'Postre') {
        code_category = 3;
      }

      // Asignar código de tipo según el tipo ingresado (si se proporciona)
      if (type === 'Vegano') {
        code_type = 1;
      } else if (type === 'Vegetariano') {
        code_type = 2;
      } else if (type === 'Celiaco') {
        code_type = 3;
      }

      // Insertar el producto en la base de datos si no existe
      await insertFood(code_category, name, description, stock, pointReOrder, code_type);
      return { success: true, message: `${name} ha sido cargado.` };
    }
  } catch (error) {
    console.error(`Error al cargar ${name}:`, error);
    return { success: false, message: `Error al cargar ${name}` };
  }
}

/**
 * Realiza la acción de dar de baja un alimento.
 * @param {string} name - El nombre del alimento a dar de baja.
 * @returns {Object} - Objeto con el resultado de la acción.
 */
async function handleDown(name) {
  try {
    console.log('Realizando acción de baja...');
    const food = await getTotalDataFoodByName(name);

    if (food[0] !== undefined) {
      if (food[0].state === 'I') { // Verificar si el producto ya está dado de baja
        return { success: false, message: `${name} ya está dado de baja.` };
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
 * @returns {Object} - Objeto con el resultado de la acción.
 */
async function handleUpdateStock(name, stock) {
  try {
    console.log('Realizando acción de actualización de stock...');
    const food = await getTotalDataFoodByName(name);

    if (food[0] !== undefined) {
      if (food[0].state === 'I') { // Verificar si el producto ya está dado de baja
        return { success: false, message: `${name} está dado de baja.` };
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
