import { StyleSheet, View, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import MainMenu from "./pages/MainMenu";
import Admin from "./pages/Admin";
import FoodPicker from "./pages/FoodPicker";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Options from "./pages/Options";
import OrderPickUp from "./pages/OrderPickUp";
import OrderConfirm from "./pages/OrderConfirm";
import Toast from "react-native-toast-message";
import { initializeDatabase } from "./service_db/DBInit";
import {
  getValidMemberById,
  getValidMembers,
  getUsers,
  getUserById,
  insertUser,
  insertValidMember,
  insertFaceData,
  insertParameters,
  getAllFood,
  getFoodByID,
  getOrdersForSupplier,
  getLoginLogs,
  getOrderRetireLogs,
} from "./service_db/DBQuerys";
import { createTriggers, dropTriggers } from "./service_db/DBTriggers";
import { basicHash } from "./utils/Hash";
import { registerRestockerTask } from "./services/RestockerTask";
import ManageMembers from "./pages/ManageMembers";
import ManageMenus from "./pages/ManageMenus";
import { chargeFoodsInDatabase } from "./service_db/DBChargeFoods";
import ManageGuests from "./pages/ManageGuests";
import UserList from "./pages/UserList";
import Logs from "./pages/Logs";

export default function App() {
  const [page, setPage] = useState(<View />);
  StatusBar.setHidden(true);

  useEffect(() => {
    initializeDatabase();
    insertParameters();
    chargeFoodsInDatabase();

    dropTriggers();
    createTriggers();
    getOrdersForSupplier();

    registerRestockerTask();

    insertUser(
      "00000000-0000",
      1,
      basicHash("admin", "admin_salt"),
      "admin_salt"
    );
    insertValidMember("00000000-0000", "Admin", "Admin");
    insertValidMember("87654321-1234", "NombreTest", "ApellidoTest");
    insertValidMember("12345678-1234", "Nombresito", "Apellidito");
    goTo();
  }, []);

  const goTo = (
    option = "MainMenu",
    data = {},
    before = () => {
      goTo("MainMenu");
    },
    after = () => {}
  ) => {
    switch (option) {
      case "FoodPicker":
        setPage(
          <FoodPicker data={data} before={before} after={after} goTo={goTo} />
        );
        break;
      case "OrderConfirm":
        setPage(<OrderConfirm data={data} before={before} after={after} />);
        break;
      case "Login":
        setPage(<Login data={data} before={before} after={after} />);
        break;
      case "Logs":
        setPage(<Logs goTo={goTo} />);
        break;
      case "Register":
        setPage(<Register data={data} goTo={goTo} />);
        break;
      case "Options":
        setPage(<Options goTo={goTo} />);
        break;
      case "Admin":
        setPage(<Admin goTo={goTo} />);
        break;
      case "UserList":
        setPage(<UserList data={data} goTo={goTo} />);
        break;
      case "ManageMenus":
        setPage(<ManageMenus data={data} before={before} goTo={goTo} />);
        break;
      case "ManageMembers":
        setPage(<ManageMembers data={data} before={before} goTo={goTo} />);
        break;
      case "ManageGuests":
        setPage(<ManageGuests data={data} before={before} goTo={goTo} />);
        break;
      case "OrderPickUp":
        setPage(<OrderPickUp data={data} goTo={goTo} />);
        break;
      case "MainMenu":
        setPage(<MainMenu goTo={goTo} />);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {page}
      <Toast visibilityTime={7500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    width: "100%",
    position: "relative",
    // paddingTop: StatusBar.currentHeight,
  },
});
