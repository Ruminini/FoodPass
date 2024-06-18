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
import Add from "../assets/svg/add.svg";
import SelectedMenuList from "../components/SelectedMenuList";
import SelectedFoodItem from "../components/SelectedFoodItem";
import Toast from "react-native-toast-message";
import * as FileSystem from 'expo-file-system';
import {
  getAllFoodWithStockAndActive,
  getRelationOfFood,
  insertMenu,
} from "../service_db/DBQuerys.jsx"; // Importar las funciones de la DB

export default function FoodPicker({ data, before, after, goTo }) {
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    celiac: false,
    type: "comida",
  });
  const [selectedFoods, setSelectedFoods] = useState(data.foods || []);
  const [foods, setFoods] = useState([]);
  const [foodImages, setFoodImages] = useState({});
  const adminMode = data.adminMode;

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

  useEffect(() => {
    // Cargar imágenes para los alimentos seleccionados
    const loadImages = async () => {
      const images = {};
      await Promise.all(foods.map(async (food) => {
        const uri = await getImageUri(food.image_path);
        images[food.id] = uri;
      }));
      setFoodImages(images);
    };

    loadImages();
  }, [foods]);

  const getImageUri = async (fileName) => {
    try {
      const uri = `${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        return uri;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return null;
    }
  };

  const foodList = foods.filter((food) => matchesFilters(food, filters));
  const totalPrice = selectedFoods.reduce((acc, food) => acc + food.price, 0);
  // Guarda las comidas seleccionadas y cambia el color del front
  function toggleSelectedFood(food) {
    if (adminMode) {
      after(food)
      return
    }
    if (selectedFoods.includes(food)) {
      setSelectedFoods(
        selectedFoods.filter((selectedFood) => selectedFood.id !== food.id)
      );
    } else {
      const hasSameType = selectedFoods.some((selectedFood) => selectedFood.type_code === food.type_code);
      
      // Si la comida que se selecciona tiene el mismo tipo que otra que ya está entonces no permite seleccionarla
      if (!hasSameType) {
        setSelectedFoods([...selectedFoods, food]);
      } else {
        Toast.show({
          type: "error",
          text1: "Solo un tipo de comida/bebida/postre por menú",
          text2: "Seleccione uno solo de cada",
        });
      }
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
      const foodIds = selectedFoods.map((food) => food.id);
      insertMenu(id, foodIds)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Pedido Realizado",
          text2: "Gracias por tu pedido " + id,
        });
        // Crear una copia de selectedFoods con el stock reducido en 1
        const updatedSelectedFoods = selectedFoods.map(food => ({
          ...food,
          stock: food.stock - 1,
        }));

        console.log("Gracias por pedir", id);
        console.log("Tu pedido:", updatedSelectedFoods);
        goTo("MainMenu");
      }).catch(() => {
        Toast.show({
          type: "error",
          text1: "Pedido Cancelado",
          text2: "Ya hiciste tu pedido por hoy " + id,
        });
        console.log("Pedido rechazado", id);
        goTo("MainMenu");
      })
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <View style={{ height: "100%", overflow: "hidden", justifyContent: "center", aspectRatio: 1 }}>
          <BackButton onPress={before} />
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
        <View style={{ height: "100%", overflow: "hidden", justifyContent: "center", aspectRatio: 1 }}>
          { adminMode ?
            <TabIcon
              svg={<Add fill="#007bff" />}
              onPress={() => {after({})}}
              style={ {padding: 10} }
              selected={filters.type === "admin"}
            /> :
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
          />}
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
            imgPath={foodImages[food.id]}
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
              imgPath={foodImages[food.id]}
              onPress={() => toggleSelectedFood(food)}
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

  if (filters.type === "bebida") {
    // Las vegetarianas no tienen restricción
    if (filters.vegan && !food.restrictions.includes(1)) return false; // 1: vegano
    if (filters.celiac && !food.restrictions.includes(3)) return false; // 3: celíaco
  }
  if (filters.type === "postre") {
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
