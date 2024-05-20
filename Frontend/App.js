import { StyleSheet, View, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import FaceScan from './components/FaceScan';
import OfflineLogin from './components/OfflineLogin';
import MainMenu from './pages/MainMenu';
import ConfigMenu from './pages/ConfigMenu'
import FoodPicker from './pages/FoodPicker';
import Register from './pages/Register';
import Toast from 'react-native-toast-message';
import Login from './pages/Login';
import Options from './pages/Options';
import { initializeDatabase } from './service_db/Database';
import OrderPickUp from './pages/OrderPickUp';

export default function App() {
  const [page, setPage] = useState(<View />);
  useEffect(() => setPage(<MainMenu goTo={goTo} />), []);
  useEffect(() => initializeDatabase(), [])

  const goTo = (option='MainMenu', data={}, before=() => {}, after=() => {}) => {
    switch (option) {
      case "FoodPicker":
        setPage(<FoodPicker data={data} goTo={goTo} />);
        break;
      case 'Login':
        setPage(<Login data={data} before={before} after={after} goTo={goTo}/>);
        break;
      case "Register":
        setPage(<Register data={data} goTo={goTo} />);
        break;
      case 'Options':
        setPage(<Options goTo={goTo}/>);
        break;
      case 'ConfigMenu':
        setPage(<ConfigMenu goTo={goTo}/>);
        break;
      case 'OrderPickUp':
        setPage(<OrderPickUp data={data} goTo={goTo} />);
        break;
      case 'MainMenu':
        setPage(<MainMenu goTo={goTo} />);
        break;
    }
  };

  return (
      <View style={styles.container}>
        {page}
        <Toast visibilityTime={7500}/>
      </View>
  );
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
