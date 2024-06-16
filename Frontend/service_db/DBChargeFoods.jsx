import { getRelationOfFood, insertFood } from "./DBQuerys";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const foods = [
    {
        typeCode: 1,
        name: "Pollo al horno",
        description: "Pollo al horno gratinado con finas hierbas",
        stock: 150,
        pointReOrder: 50,
        restrictions: [], // vacío ninguna, 1 vegano, 2 vegetariano, 3 celíaco
        imageUri: require("../assets/foods/Pollo_al_horno.jpg"),
    },
    {
        typeCode: 1,
        name: "Milanesa de carne con fritas",
        description: "Milanesa de carne frita con papas fritas",
        stock: 150,
        pointReOrder: 50,
        restrictions: [],
        imageUri: require("../assets/foods/Milanesa_de_carne_con_fritas.jpg"),
    },
    {
        typeCode: 1,
        name: "Tacos",
        description: "Tacos veganos de garbanzos y soja.",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2],
        imageUri: require("../assets/foods/Tacos.jpg"),
    },
    {
        typeCode: 1,
        name: "Canelones de espinaca y ricota",
        description: "Canelones vegetarianos de espinaca y ricota con salsa de tomate",
        stock: 150,
        pointReOrder: 50,
        restrictions: [2],
        imageUri: require("../assets/foods/Canelones_de_espinaca_y_ricota.jpg"),
    },
    {
        typeCode: 1,
        name: "Guiso de lentejas",
        description: "Guiso de lentejas con cebolla, ajo y pimentón suave",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2, 3],
        imageUri: require("../assets/foods/Guiso_de_lentejas.jpg"),
    },
    {
        typeCode: 2,
        name: "Gaseosa sabor cola",
        description: "Fresca gaseosa sabor cola de 500 ml",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2, 3],
        imageUri: require("../assets/foods/Gaseosa_sabor_cola.jpg"),
    },
    {
        typeCode: 2,
        name: "Café",
        description: "Café que puede pedirse con leche o sin",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2, 3],
        imageUri: require("../assets/foods/Café.jpg"),
    },
    {
        typeCode: 2,
        name: "Jugo de remolacha y stevia",
        description: "Jugo dulce con azucares naturales y bajos carbohidratos.",
        stock: 50,
        pointReOrder: 50,
        restrictions: [1],
        imageUri: require("../assets/foods/Jugo_de_remolacha_y_stevia.jpg"),
    },
    {
        typeCode: 2,
        name: "Mocaccino",
        description: "Café con leche y chocolate, especial para días fríos.",
        stock: 150,
        pointReOrder: 50,
        restrictions: [2],
        imageUri: require("../assets/foods/Mocaccino.jpg"),
    },
    {
        typeCode: 2,
        name: "Jugo de naranja",
        description: "Jugo de naranja sin azúcares agregados.",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2, 3],
        imageUri: require("../assets/foods/Jugo_de_naranja.jpg"),
    },
    {
        typeCode: 3,
        name: "Budín de pan",
        description: "Budín de pan al horno con dulce de leche",
        stock: 150,
        pointReOrder: 50,
        restrictions: [2],
        imageUri: require("../assets/foods/Budín_de_pan.jpg"),
    },
    {
        typeCode: 3,
        name: "Helado de menta granizada y chocolate",
        description: "Helado del mejor gusto posible y textura exquisita",
        stock: 150,
        pointReOrder: 50,
        restrictions: [2],
        imageUri: require("../assets/foods/Helado_de_menta_granizada_y_chocolate.jpg"),
    },
    {
        typeCode: 3,
        name: "Magdalenas",
        description: "Magdalenas de limón sin gluten, sin huevo y sin leche",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2],
        imageUri: require("../assets/foods/Magdalenas.jpg"),
    },
    {
        typeCode: 3,
        name: "Panqueques rellenos de dulce de leche",
        description: "Panqueques con dulce de leche.",
        stock: 150,
        pointReOrder: 50,
        restrictions: [2],
        imageUri: require("../assets/foods/Panqueques_rellenos_de_dulce_de_leche.jpg"),
    },
    {
        typeCode: 3,
        name: "Alfajores de arroz",
        description: "Alfajores de arroz suaves y ricos",
        stock: 150,
        pointReOrder: 50,
        restrictions: [1, 2, 3],
        imageUri: require("../assets/foods/Alfajores_de_arroz.jpg"),
    },
];

//Carga las primeras 15 comidas y sus respectivas imágenes
export const chargeFoodsInDatabase = async () => {
    try {
        for (const food of foods) {
            const imageUri = food.imageUri;
            const imageName = imageUri.toString().split('/').pop(); // Obtener el nombre de la imagen
            const imagePath = await copyImageToFilesystem(imageUri, imageName);

            insertFood(
                food.typeCode,
                food.name,
                food.description,
                food.stock,
                food.pointReOrder,
                food.restrictions,
                imagePath // Ruta de la imagen en el sistema de archivos
            );
        }

        await handleRelations();
    } catch (error) {
        console.error('Error al cargar alimentos en la base de datos:', error);
    }
};

//Guarda las imágenes en el FileSystem del dispositivo
const copyImageToFilesystem = async (imageUri, imageName) => {
    const imagePath = FileSystem.documentDirectory + imageName;
    try {
        const asset = await Asset.fromModule(imageUri).downloadAsync();
        await FileSystem.copyAsync({
            from: asset.localUri,
            to: imagePath,
        });
        return imagePath;
    } catch (error) {
        console.error(`Error copying image ${imageName}:`, error);
        return null;
    }
};

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