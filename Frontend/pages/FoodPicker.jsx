import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MenuList from "../components/MenuList";
import FoodItem from "../components/FoodItem";
import TabIcon from "../components/TabIcon";
import BackButton from "../components/BackButton";
import Food from "../assets/svg/food.svg";
import Drinks from "../assets/svg/drinks.svg";
import Dessert from "../assets/svg/dessert.svg";
import Vegetarian from "../assets/svg/vegetarian.svg";
import Vegan from "../assets/svg/vegan.svg";
import Celiac from "../assets/svg/celiac.svg";
import SelectedMenuList from "../components/SelectedMenuList";
import SelectedFoodItem from "../components/SelectedFoodItem";
import Toast from "react-native-toast-message";
import {
  getAllFoodWithStockAndActive,
  getRelationOfFood,
} from "../service_db/DBQuerys.jsx"; // Importar las funciones de la DB

export default function FoodPicker({ data, goTo }) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    celiac: false,
    type: "comida",
  });
  const [selectedFoods, setSelectedFoods] = useState(data.foods || []);
  const foodList = foods.filter((food) => matchesFilters(food, filters));
  const totalPrice = selectedFoods.reduce((acc, food) => acc + food.price, 0);
  // useEffect(() => console.log(selectedFoods.map(food => food.title)), [selectedFoods]);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    // Cargar alimentos con stock y activos desde la base de datos
    const loadFoods = async () => {
      try {
        const foodData = await getAllFoodWithStockAndActive();
        const relations = await getRelationOfFood();
        // Asignar restricciones a los alimentos
        const foodsWithRestrictions = foodData.map((food) => {
          const foodRelations = relations.filter(
            (relation) => relation.id_food === food.id
          );
          const foodRestrictions = foodRelations.map(
            (rel) => rel.code_restriction
          );
          return {
            ...food,
            restrictions: foodRestrictions,
          };
        });

        // Si hay alimentos seleccionados previamente, marcarlos como seleccionados
        const previousMenuFoods = data.foods || [];
        const selectedFoodIDs = previousMenuFoods.map((food) => food.id);
        const selectedFoodsFromDB = foodsWithRestrictions.filter((food) =>
          selectedFoodIDs.includes(food.id)
        );

        setFoods(foodsWithRestrictions);
        setSelectedFoods(selectedFoodsFromDB);
      } catch (error) {
        console.error("Error al cargar los alimentos: ", error);
      }
    };

    loadFoods();
  }, [data.foods]);

  // Guarda las comidas seleccionadas y cambia el color del front
  function toggleSelectedFood(food) {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(
        selectedFoods.filter((selectedFood) => selectedFood.id !== food.id)
      );
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  }

  const goToConfirm = () => {
    goTo(
      "OrderConfirm",
      { foods: selectedFoods, totalPrice },
      backToPicker,
      afterConfirm
    );
  };
  const backToPicker = () => {
    goTo("FoodPicker", { foods: selectedFoods });
  };
  const afterConfirm = () => {
    goTo("Login", {}, goToConfirm, (id) => {
      Toast.show({
        type: "success",
        text1: "Pedido Realizado",
        text2: "Gracias por tu pedido " + id,
      });
      // TODO: Guardar pedido en db
      console.log("Gracias por pedir", id);
      console.log("Tu pedido:", foods);
      goTo("MainMenu");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <View style={{ height: "100%", overflow: "hidden", aspectRatio: 1 }}>
          <BackButton onPress={() => goTo("MainMenu")} />
        </View>
        <TabIcon
          text="Comida"
          svg={<Food fill={filters.type === "comida" && "white"} />}
          onPress={() => setFilters({ ...filters, type: "comida" })}
          style={
            filters.type === "comida" && {
              backgroundColor: "black",
              borderRadius: 15,
            }
          }
          selected={filters.type === "comida"}
        />
        <TabIcon
          text="Bebida"
          svg={<Drinks fill={filters.type === "bebida" && "white"} />}
          onPress={() => setFilters({ ...filters, type: "bebida" })}
          style={
            filters.type === "bebida" && {
              backgroundColor: "black",
              borderRadius: 15,
            }
          }
          selected={filters.type === "bebida"}
        />
        <TabIcon
          text="Postre"
          svg={<Dessert fill={filters.type === "postre" && "white"} />}
          onPress={() => setFilters({ ...filters, type: "postre" })}
          style={
            filters.type === "postre" && {
              backgroundColor: "black",
              borderRadius: 15,
            }
          }
          selected={filters.type === "postre"}
        />
        <View style={{ height: "100%", overflow: "hidden", aspectRatio: 1 }}>
          <BackButton
            style={{ transform: [{ rotate: "180deg" }] }}
            onPress={() => {
              if (selectedFoods.length === 0) {
                Toast.show({
                  type: "info",
                  text1: "Primero debes seleccionar algún plato",
                });
                return;
              }
              goToConfirm();
            }}
          />
        </View>
      </View>
      <MenuList alignTop={true}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.filterContainer}>
            <TabIcon
              svg={<Vegetarian fill={filters.vegetarian && "white"} />}
              onPress={() =>
                setFilters({ ...filters, vegetarian: !filters.vegetarian })
              }
              style={
                filters.vegetarian && {
                  backgroundColor: "green",
                  borderRadius: 15,
                }
              }
            />
            <TabIcon
              svg={<Vegan fill={filters.vegan && "white"} />}
              onPress={() => setFilters({ ...filters, vegan: !filters.vegan })}
              style={
                filters.vegan && { backgroundColor: "green", borderRadius: 15 }
              }
            />
            <TabIcon
              svg={<Celiac fill={filters.celiac && "white"} />}
              onPress={() =>
                setFilters({ ...filters, celiac: !filters.celiac })
              }
              style={
                filters.celiac && { backgroundColor: "green", borderRadius: 15 }
              }
            />
          </View>
        </View>
        {foodList.map((food, index) => (
          <FoodItem
            selected={selectedFoods.some(
              (selectedFood) => selectedFood.id === food.id
            )}
            key={index}
            title={food.name}
            description={food.description}
            // stock = {food.stock} Si se quiere mostrar el stock con la comida
            onPress={() => toggleSelectedFood(food)}
          />
        ))}
      </MenuList>
      {selectedFoods.length > 0 && (
        <SelectedMenuList style={{ height: 200 }}>
          {selectedFoods.map((food, index) => (
            <SelectedFoodItem
              key={index}
              title={food.name}
              onPress={() => console.log(food.name)}
            />
          ))}
        </SelectedMenuList>
      )}
    </View>
  );
}

// Filtra los alimentos dependiendo de si son comida, bebida o postre y carga las restricciones de vegano, vegetariano y celíaco
function matchesFilters(food, filters) {
  if (filters.type === "comida" && food.type_code !== 1) return false; // 1: comida_principal
  if (filters.type === "bebida" && food.type_code !== 2) return false; // 2: bebida
  if (filters.type === "postre" && food.type_code !== 3) return false; // 3: postre

  if (filters.type === "comida") {
    if (filters.vegan && !food.restrictions.includes(1)) return false; // 1: vegano
    if (
      filters.vegetarian &&
      !food.restrictions.includes(2) &&
      !food.restrictions.includes(1)
    )
      return false; // 2: vegetariano, 1: vegano
    if (filters.celiac && !food.restrictions.includes(3)) return false; // 3: celíaco
  }

  if (filters.type !== "comida") {
    if (filters.vegan && !food.restrictions.includes(1)) return false; // 1: vegano
    if (
      filters.vegetarian &&
      !food.restrictions.includes(2) &&
      !food.restrictions.includes(1)
    )
      return false; // 2: vegetariano, 1: vegano
    if (filters.celiac && !food.restrictions.includes(3)) return false; // 3: celíaco
  }

  return true;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    height: "10%",
    position: "relative",
    paddingVertical: 10,
    elevation: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 75,
    width: 250,
    elevation: 2,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 25,
  },
});
