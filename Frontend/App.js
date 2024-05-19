import { StyleSheet, View, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import FaceScan from "./pages/FaceScan";
import OfflineLogin from "./pages/OfflineLogin";
import MainMenu from "./pages/MainMenu";
import ConfigMenu from "./pages/ConfigMenu";
import FoodPicker from "./pages/FoodPicker";
import Register from "./pages/Register";
import Options from "./pages/Options";
import { initializeDatabase, getValidMember, getUsers } from "./service_db/Database";
// import useDatabase from "./hooks/useDatabase"; // Import the hook

export default function App() {
  const [page, setPage] = useState(<View />);
  useEffect(() => setPage(<MainMenu onPress={handleMainMenuButton} />), []);
  useEffect(() => {
    initializeDatabase()
    console.log("Database initialized");
  }, []);
  // const { fetchMember } = useDatabase();

  // const handleFetchMember = (memberCode) => {
  //   const memberData = fetchMember(memberCode);
  //   console.log("ACA", memberData); // Use the member data here
  // };

  // useEffect(() => {
  //   handleFetchMember("34985578-2024");
  // }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const users = await getUsers();
        console.log("USERS", users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  const setMainMenu = () => {
    setPage(<MainMenu onPress={handleMainMenuButton} />);
  };

  // Si no hay conexión muestra la página con el login offline
  const setOfflineLogin = () => {
    setPage(<OfflineLogin onPress={handleDefault} />);
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
      case "Options":
        setPage(<Options onPress={handleDefault} />);
        break;
      case "ConfigMenu":
        setPage(<ConfigMenu onPress={handleDefault} />);
        break;
    }
  };

  const handleDefault = (values) => {
    if (values == "cancel") {
      setMainMenu();
      return;
    }
    if (values == "noConnection") {
      setOfflineLogin();
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
