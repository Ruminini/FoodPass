import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from "react";
import MenuList from '../components/MenuList'
import FoodItem from '../components/FoodItem'
import TabIcon from '../components/TabIcon'
import BackButton from '../components/BackButton'
import Food from '../assets/svg/food.svg'
import Drinks from '../assets/svg/drinks.svg'
import Dessert from '../assets/svg/dessert.svg'
import Vegetarian from '../assets/svg/vegetarian.svg'
import Vegan from '../assets/svg/vegan.svg'
import Celiac from '../assets/svg/celiac.svg'
import SelectedMenuList from '../components/SelectedMenuList'
import SelectedFoodItem from '../components/SelectedFoodItem';

export default function FoodPicker() {
    const [filters, setFilters] = useState({vegan: false, vegetarian: false, celiac: false, type: 'comida'})
    const [selectedFoods, setSelectedFoods] = useState([])
    const foodList = foods.filter(food => matchesFilters(food, filters))
    const totalPrice = selectedFoods.reduce((acc, food) => acc + food.price, 0)
    // useEffect(() => console.log(selectedFoods.map(food => food.title)), [selectedFoods]);
    function toggleSelectedFood(food) {
        if (selectedFoods.includes(food)) {
            setSelectedFoods(selectedFoods.filter(selectedFood => selectedFood !== food))
        } else {
            setSelectedFoods([...selectedFoods, food])
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <BackButton onPress={() => console.log('Volver')} />
                <TabIcon
                    text='Comida'
                    svg={<Food fill={filters.type === 'comida' && 'white'}/>}
                    onPress={() => setFilters({...filters, type: 'comida'})}
                    style={filters.type === 'comida' && {backgroundColor: 'black', borderRadius: 15}}
                    selected={filters.type === 'comida'}
                />
                <TabIcon
                    text='Bebida'
                    svg={<Drinks fill={filters.type === 'bebida' && 'white'}/>}
                    onPress={() => setFilters({...filters, type: 'bebida'})}
                    style={filters.type === 'bebida' && {backgroundColor: 'black', borderRadius: 15}}
                    selected={filters.type === 'bebida'}
                />
                <TabIcon
                    text='Postre'
                    svg={<Dessert fill={filters.type === 'postre' && 'white'}/>}
                    onPress={() => setFilters({...filters, type: 'postre'})}
                    style={filters.type === 'postre' && {backgroundColor: 'black', borderRadius: 15}}
                    selected={filters.type === 'postre'}
                />
                <BackButton style={{transform: [{rotate: '180deg'}]}} onPress={() => console.log('Volver')} />
            </View>
            <MenuList>
                {filters.type === 'comida' &&
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.filterContainer}>
                            <TabIcon
                                svg={<Vegetarian fill={filters.vegetarian && 'white'}/>}
                                onPress={() => setFilters({...filters, vegetarian: !filters.vegetarian})}
                                style={filters.vegetarian && {backgroundColor: 'green', borderRadius: 15}}
                            />
                            <TabIcon
                                svg={<Vegan fill={filters.vegan && 'white'}/>}
                                onPress={() => setFilters({...filters, vegan: !filters.vegan})}
                                style={filters.vegan && {backgroundColor: 'green', borderRadius: 15}}
                            />
                            <TabIcon
                                svg={<Celiac fill={filters.celiac && 'white'}/>}
                                onPress={() => setFilters({...filters, celiac: !filters.celiac})}
                                style={filters.celiac && {backgroundColor: 'green', borderRadius: 15}}
                            />
                        </View>
                    </View>
                }
                {foods.map((food, index) => (
                    matchesFilters(food, filters) &&
                    <FoodItem
                    selected={selectedFoods.includes(food)}
                    key={index}
                    title={food.title}
                    description={food.description}
                    onPress={() => toggleSelectedFood(food)} />
                ))}
            </MenuList>
            {selectedFoods.length > 0 &&
            <SelectedMenuList style={{height: 200}}>
                {selectedFoods.map((food, index) => (
                    <SelectedFoodItem
                    key={index}
                    title={food.title}
                    onPress={() => console.log(food.title)} />
                ))}
            </SelectedMenuList>
            }
        </View>
    )
}

function matchesFilters(food, filters) {
    if (filters.type !== food.type) return false
    if (food.type !== 'comida') return true
    if (filters.vegetarian && !(food.vegetarian || food.vegan)) return false
    if (filters.vegan && !food.vegan) return false
    if (filters.celiac && !food.celiac) return false
    return true
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        height: '10%',
        position: 'relative',
        paddingVertical: 10,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 75,
        width: 250,
        elevation: 2,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 25,
    }
})

const foods = [
    {
        title: "Canelones a la criolla",
        description:
            "Canelones rellenos de carne picada y espinaca, bañados en salsa de tomate.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: false,
    },
    {
        title: "Pastel de papas",
        description:
            "Capas de puré de papas, carne molida y huevo duro, gratinado al horno.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: true,
    },
    {
        title: "Matambre al roquefort",
        description: "Matambre relleno de roquefort y nueces, asado a la parrilla.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: false,
    },
    {
        title: "Revuelto gramajo",
        description: "Revuelto de papas fritas, huevo, jamón y cebolla.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: true,
    },
    {
        title: "Puchero criollo",
        description: "Guiso tradicional con carne, chorizo, zapallo y maíz.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: true,
    },
    {
        title: "Tarta de choclo",
        description: "Tarta rellena de choclo, queso y pimiento morrón.",
        type: "comida",
        vegetarian: true,
        vegen: false,
        celiac: false,
    },
    {
        title: "Bondiola al malbec",
        description:
            "Bondiola de cerdo cocida lentamente en salsa de malbec y cebolla.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: true,
    },
    {
        title: "Chivito a la parrilla",
        description:
            "Sandwich de carne de chivo asada, lechuga, tomate, panceta y huevo.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: false,
    },
    {
        title: "Pollo al curry criollo",
        description: "Pollo marinado en especias criollas con curry y papas.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: false,
    },
    {
        title: "Pizza de Vegetales Asados",
        description: "Una pizza con base de masa fina, cubierta con salsa de tomate, mozzarella, y vegetales asados como berenjena, pimientos y champiñones.",
        type: "comida",
        vegetarian: true,
        vegan: false,
        celiac: false
    },
    {
        title: "Empanadas de Espinaca y Queso",
        description: "Empanadas rellenas de espinaca cocida y queso cremoso.",
        type: "comida",
        vegetarian: true,
        vegan: false,
        celiac: false
    },
    {
        title: "Tarta de Zapallitos y Queso",
        description: "Tarta rellena de zapallitos rallados y queso, con una base de masa crocante.",
        type: "comida",
        vegetarian: true,
        vegan: false,
        celiac: false
    },
    {
        title: "Milanesa de Soja",
        description: "Milanesa vegetal hecha con proteína de soja marinada y empanizada, acompañada de ensalada fresca.",
        type: "comida",
        vegetarian: true,
        vegan: false,
        celiac: false
    },
    {
        title: "Risotto de Hongos",
        description: "Risotto cremoso cocinado con hongos, cebolla y caldo de verduras.",
        type: "comida",
        vegetarian: true,
        vegan: false,
        celiac: false
    },
    {
        title: "Arroz con pollo y vegetales",
        description: "Arroz salteado con trozos de pollo, zanahorias y arvejas.",
        type: "comida",
        vegetarian: false,
        vegen: false,
        celiac: true,
    },
    {
        title: "Hamburguesa de Lentejas",
        description: "Hamburguesa vegana elaborada con lentejas cocidas, cebolla, ajo y especias, servida con pan integral y vegetales frescos.",
        type: "comida",
        vegetarian: true,
        vegan: true,
        celiac: false
    },
    {
        title: "Fideos de Calabacín con Pesto Vegano",
        description: "Fideos de calabacín crudos acompañados de pesto vegano hecho con albahaca, nueces, ajo y levadura nutricional.",
        type: "comida",
        vegetarian: true,
        vegan: true,
        celiac: true
    },
    {
        title: "Ensalada Vegana de Quinoa y Verduras",
        description: "Ensalada refrescante con quinoa cocida, tomate cherry, pepino, aguacate y aderezo de limón y aceite de oliva.",
        type: "comida",
        vegetarian: true,
        vegan: true,
        celiac: true
    },
    {
        title: "Burrito Vegano de Frijoles Negros",
        description: "Burrito relleno de frijoles negros refritos, arroz, aguacate, pico de gallo y salsa picante, envuelto en tortilla de maíz.",
        type: "comida",
        vegetarian: true,
        vegan: true,
        celiac: false
    },
    {
        title: "Curry de Verduras al Coco",
        description: "Curry vegano con verduras mixtas cocinadas en leche de coco y especias, servido con arroz basmati.",
        type: "comida",
        vegetarian: true,
        vegan: true,
        celiac: true
    },
    {
        title: "Mate frío con limón",
        description: "Mate frío con jugo de limón y hojas de menta.",
        type: "bebida",
    },
    {
        title: "Clara con limón",
        description: "Cerveza rubia con jugo de limón y hielo.",
        type: "bebida",
    },
    {
        title: "Vino dulce de uva",
        description: "Vino tinto suave y dulce con sabor a uva.",
        type: "bebida",
    },
    {
        title: "Fernet con pomelo",
        description: "Fernet con soda y rodajas de pomelo.",
        type: "bebida",
    },
    {
        title: "Licuado de frutilla",
        description: "Licuado cremoso de frutilla con leche y azúcar.",
        type: "bebida",
    },
    {
        title: "Jugo de naranja exprimido",
        description: "Jugo fresco de naranja recién exprimido.",
        type: "bebida",
    },
    {
        title: "Café con crema",
        description: "Café espresso con crema batida y cacao en polvo.",
        type: "bebida",
    },
    {
        title: "Sidra de manzana",
        description: "Sidra de manzana natural con burbujas refrescantes.",
        type: "bebida",
    },
    {
        title: "Trago de frutas tropicales",
        description: "Cóctel refrescante con ron, jugo de piña y coco rallado.",
        type: "bebida",
    },
    {
        title: "Limonada casera",
        description: "Limonada hecha con limones frescos y azúcar.",
        type: "bebida",
    },
    {
        title: "Alfajor de chocolate blanco",
        description:
            "Dulce de leche entre dos galletas bañadas en chocolate blanco.",
        type: "postre",
    },
    {
        title: "Flan de dulce de leche",
        description: "Flan tradicional argentino con abundante dulce de leche.",
        type: "postre",
    },
    {
        title: "Queso y dulce",
        description: "Queso cremoso acompañado de dulce de batata casero.",
        type: "postre",
    },
    {
        title: "Torta de ricota",
        description: "Torta suave de ricota con pasas de uva y cáscara de limón.",
        type: "postre",
    },
    {
        title: "Helado de dulce de leche granizado",
        description: "Helado cremoso de dulce de leche con trocitos de chocolate.",
        type: "postre",
    },
    {
        title: "Pastelitos de membrillo",
        description:
            "Pastelitos rellenos de membrillo y espolvoreados con azúcar impalpable.",
        type: "postre",
    },
    {
        title: "Panqueques de dulce de leche",
        description:
            "Panqueques rellenos con abundante dulce de leche y espolvoreados con azúcar.",
        type: "postre",
    },
    {
        title: "Bombón suizo",
        description: "Chocolate relleno con crema y licor, decorado con almendras.",
        type: "postre",
    },
    {
        title: "Mazamorra con arroz con leche",
        description: "Mazamorra tradicional acompañada de arroz con leche cremoso.",
        type: "postre",
    },
    {
        title: "Tiramisú criollo",
        description: "Postre de tiramisú con un toque de dulce de leche.",
        type: "postre",
    },
];


