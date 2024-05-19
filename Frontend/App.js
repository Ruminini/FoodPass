import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useState, useEffect } from "react";
import FaceScan from "./pages/FaceScan";
import MainMenu from "./pages/MainMenu";
import ConfigMenu from "./pages/ConfigMenu";
import FoodPicker from "./pages/FoodPicker";
import Register from "./pages/Register";
import HomeScreen from "./pages/HomeScreen";
import { initializeDatabase } from "./services/Database";

export default function App() {
  const [page, setPage] = useState(<View />);
  useEffect(() => setPage(<MainMenu onPress={handleMainMenuButton} />), []);
  useEffect(() => initializeDatabase(), []);

  const setMainMenu = () => {
    setPage(<MainMenu onPress={handleMainMenuButton} />);
  };

  const handleMainMenuButton = (option) => {
    switch (option) {
      case "FoodPicker":
        setPage(<FoodPicker onPress={handleDefault} />);
        break;
      case "FaceScan":
        setPage(<FaceScan onPress={handleDefault} />);
        break;
      case "Register":
        setPage(<Register onPress={handleDefault} />);
        break;
      case "ConfigMenu":
        setPage(<ConfigMenu onPress={handleDefault} />);
        break;
    }
  };

  const handleRegister = (values) => {
    if (values == "cancel") {
      setMainMenu();
      return;
    }
    console.log(values);
  };
  const handleDefault = (values) => {
    if (values == "cancel") {
      setMainMenu();
      return;
    }
    console.log(values);
    setMainMenu();
  };

  return <View style={styles.container}>{page}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    width: "100%",
    position: "relative",
    paddingTop: StatusBar.currentHeight,
  },
});
