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
import foods from '../data/foods.json'

export default function FoodPicker({onPress}) {
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
			    <View style={{ height: '100%', overflow: 'hidden', aspectRatio: 1}}>
                    <BackButton onPress={() => onPress('cancel')}/>
                </View>
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
                <View style={{ height: '100%', overflow: 'hidden', aspectRatio: 1}}>
                    <BackButton style={{transform: [{rotate: '180deg'}]}} onPress={() => onPress(selectedFoods)} />
                </View>
            </View>
            <MenuList alignTop={true}>
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
