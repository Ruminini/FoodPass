import { getRelationOfFood, insertFood } from "./DBQuerys";

export const chargeFoodsInDatabase = async () => {

    // Dos comidas principales sin restricción, una vegana, una vegetariana y una celíaca

    insertFood(
        1, // Tipo de Alimento 1 (Comida principal), 2 (bebida) y 3 (postre)
        "Pollo al horno", // Nombre de alimento
        "Pollo al horno gratinado con finas hierbas", // Descripción del alimento
        150, // Stock del alimento
        50, // Punto de reorden
        // Restricción. Nada = ninguna, 1 = vegano, 2 = vegetariano, 3 = celíaco
    );
    insertFood(
        1, 
        "Milanesa de carne con fritas", 
        "Milanesa de carne frita con papas fritas",
        150,
        50,
    ); 
    insertFood(
        1, 
        "Tacos", 
        "Tacos veganos de garbanzos y soja.",
        150,
        50,
        [1, 2]
    );
    insertFood(
        1, 
        "Canelones de espinaca y ricota", 
        "Canelones vegetarianos de espinaca y ricota con salsa de tomate",
        150,
        50,
        [2]
    );
    insertFood(
        1, 
        "Guiso de lentejas", 
        "Guiso de lentejas con cebolla, ajo y pimentón suave",
        150,
        50,
        [1, 2, 3]
    );
    // Dos bebidas sin restricción, una vegana, una vegetariana y una celíaca

    insertFood(
        2, 
        "Gaseosa sabor cola", 
        "Fresca gaseosa sabor cola de 500 ml",
        150,
        50,
        [1, 2, 3]
    );
    insertFood(
        2, 
        "Café", 
        "Café que puede pedirse con leche o sin",
        150,
        50,
        [1, 2, 3]
    );
    insertFood(
        2, 
        "Jugo de remolacha y stevia", 
        "Jugo dulce con azucares naturales y bajos carbohidratos.",
        50,
        50,
        [1]
    );
    insertFood(
        2, 
        "Mocaccino", 
        "Café con leche y chocolate, especial para días fríos.",
        150,
        50,
        [2]
    );
    insertFood(
        2, 
        "Jugo de naranja", 
        "Jugo de naranja sin azúcares agregados.",
        150,
        50,
        [1,2,3]
    );

    // Dos postres sin restricción, uno vegano, uno vegetariano y uno celíaco

    insertFood(
        3, 
        "Budín de pan", 
        "Budín de pan al horno con dulce de leche",
        150,
        50,
        [2]
    );
    insertFood(
        3, 
        "Helado de Menta Granizada y Chocolate", 
        "Helado del mejor gusto posible y textura exquisita",
        150,
        50,
        [2]
    );
    insertFood(
        3, 
        "Magdalenas",
        "Magdalenas de limón sin gluten, sin huevo y sin leche",
        150,
        50,
        [1,2]
    );
    insertFood(
        3, 
        "Panqueques rellenos de dulce de leche", 
        "Panqueques con dulce de leche.",
        150,
        50,
        [2]
    );
    insertFood(
        3, 
        "Alfajores de arroz", 
        "Alfajores de arroz suaves y ricos",
        150,
        50,
        [1,2,3]
    );
    // Llama a la función para nostrar las relaciones
    handleRelations();
}

// Función para mostrar las relaciones que se crearon
export const handleRelations = async () => {
    try {
        const relations = await getRelationOfFood();
        console.log("Relaciones obtenidas:", relations);
        // Muestra los diferentes datos de las comidas y su relación
        relations.forEach(relation => {
            console.log(`Food ID: ${relation.id_food}, Restriction Code: ${relation.code_restriction}`);
            // Realiza otras operaciones necesarias con los datos obtenidos
        });
    } catch (error) {
        console.error("Error al obtener las relaciones:", error);
    }
};