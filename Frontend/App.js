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

export default function App() {
  const [page, setPage] = useState(<View />);
  useEffect(() => setPage(<MainMenu goTo={goTo} />), []);
  useEffect(() => {
    initializeDatabase();
    insertParameters();
    chargeFoodsInDatabase();
  }, []);

  useEffect(() => {
    dropTriggers();
    createTriggers();
    getOrdersForSupplier();
  }, []);

  useEffect(() => {
    registerRestockerTask();
  }, []);

  useEffect(() => {
    // Toma y muestra los logs de login de la aplicación
    const fetchLoginLogs = async () => {
      try {
        const logs = await getLoginLogs();
        console.log("El registro de logs de logins es el siguiente: " + logs);
      } catch (error) {
        console.error("Error fetching login logs:", error);
      }
    };
    // Toma y muestra los logs de retiro de pedidos de la aplicación
    const fetchOrderRetireLogs = async () => {
      try {
        const logs = await getOrderRetireLogs();
        console.log(
          "El registro de logs de los pedidos retirados es el siguiente: " +
            logs
        );
      } catch (error) {
        console.error("Error fetching order retire logs:", error);
      }
    };
    fetchLoginLogs();
    fetchOrderRetireLogs();
  }, []);

  {
    //EJEMPLOS DE USO

    //Obtener alimento por id
    useEffect(() => {
      getFoodByID(1).then((res) => console.log("Alimento elegido: ", res));
    }, []);

    //Listar alimentos
    useEffect(() => {
      getAllFood().then((res) => console.log("Lista de alimentos:", res));
    }, []);

    //Ejemplo insertando un usuario
    // useEffect(() => {
    //   insertUser(
    //     "34985578-2024",
    //     2,
    //     basicHash("Password123", "testSalt"),
    //     "testSalt"
    //   );
    // }, []);

    //Ejemplo insertando un usuario administrador en la tabla user
    useEffect(() => {
      insertUser(
        "00000000-0000",
        1,
        basicHash("admin", "admin_salt"),
        "admin_salt"
      );
    }, []);

    //Ejemplo insertando un usuario administrador en la tabla valid_member
    useEffect(() => {
      insertValidMember("00000000-0000", "Admin", "Admin");
    }, []);

    //Ejemplo obteniendo usuario por id
    // useEffect(() => {
    //   getUserById("34985578-2024").then((res) =>
    //     console.log("Usuario por id:", res)
    //   );
    // }, []);

    //Ejemplo obteniendo lista de usuarios
    useEffect(() => {
      getUsers().then((res) => console.log("Lista de usuarios:", res));
    }, []);

    //Ejemplo insertando miembro válido
    useEffect(() => {
      insertValidMember("87654321-1234", "NombreTest", "ApellidoTest");
    }, []);

    //Ejemplo obteniendo miembro valido por id
    // useEffect(() => {
    //   getValidMemberById("34985578-2024").then((res) =>
    //     console.log("Miembro valido por id:", res)
    //   );
    // }, []);

    //Ejemplo obteniendo lista de miembros válidos
    useEffect(() => {
      getValidMembers().then((res) =>
        console.log("Lista de miembros validos:", res)
      );
    }, []);

    // const descriptorExample = `{
    //     "0":-0.06022194027900696,
    //     "1":0.12927846610546112,
    //     "2":0.042801350355148315,
    //     "3":-0.04138250648975372,
    //     "4":-0.014386001974344254,
    //     "5":0.029349420219659805,
    //     "6":-0.06759197264909744,
    //     "7":-0.013019707053899765,
    //     "8":0.23711752891540527,
    //     "9":-0.07066503167152405,
    //     "10":0.16646745800971985,
    //     "11":0.059503812342882156,
    //     "12":-0.16105914115905762,
    //     "13":-0.03133654594421387,
    //     "14":-0.027843620628118515,
    //     "15":0.12257298082113266,
    //     "16":-0.10489633679389954,
    //     "17":-0.1438676416873932,
    //     "18":-0.06151187792420387,
    //     "19":-0.0623566135764122,
    //     "20":-0.00767289474606514,
    //     "21":0.08153147995471954,
    //     "22":0.053916338831186295,
    //     "23":0.03174702078104019,
    //     "24":-0.09127289056777954,
    //     "25":-0.3287324011325836,
    //     "26":-0.056721385568380356,
    //     "27":-0.17644605040550232,
    //     "28":0.03498952463269234,
    //     "29":-0.11400562524795532,
    //     "30":-0.05814623087644577,
    //     "31":0.017128203064203262,
    //     "32":-0.12440650165081024,
    //     "33":-0.017646104097366333,
    //     "34":0.05150064080953598,
    //     "35":0.08013361692428589,
    //     "36":-0.0221732035279274,
    //     "37":0.003584783524274826,
    //     "38":0.22774450480937958,
    //     "39":0.109687440097332,
    //     "40":-0.1599227339029312,
    //     "41":0.1063838005065918,
    //     "42":-0.0444587841629982,
    //     "43":0.3480082154273987,
    //     "44":0.15591411292552948,
    //     "45":0.05353599414229393,
    //     "46":-0.00039352476596832275,
    //     "47":-0.022139765322208405,
    //     "48":0.1061539500951767,
    //     "49":-0.18497300148010254,
    //     "50":0.1997356414794922,
    //     "51":0.13936647772789001,
    //     "52":0.16601404547691345,
    //     "53":0.05729345977306366,
    //     "54":0.1520184427499771,
    //     "55":-0.16308918595314026,
    //     "56":0.0053922757506370544,
    //     "57":0.08672358095645905,
    //     "58":-0.16333255171775818,
    //     "59":0.07126133143901825,
    //     "60":0.042610444128513336,
    //     "61":0.011691583320498466,
    //     "62":-0.04869789257645607,
    //     "63":-0.04354832321405411,
    //     "64":0.2148340791463852,
    //     "65":0.1284857988357544,
    //     "66":-0.1249852403998375,
    //     "67":-0.08977136015892029,
    //     "68":0.08818911015987396,
    //     "69":-0.09150513261556625,
    //     "70":-0.03405546396970749,
    //     "71":0.04660909250378609,
    //     "72":-0.12608392536640167,
    //     "73":-0.1372573971748352,
    //     "74":-0.16613540053367615,
    //     "75":0.11446450650691986,
    //     "76":0.342540442943573,
    //     "77":0.17061328887939453,
    //     "78":-0.2601119577884674,
    //     "79":0.037121325731277466,
    //     "80":-0.017448652535676956,
    //     "81":-0.01467825099825859,
    //     "82":0.03855498880147934,
    //     "83":0.0953107625246048,
    //     "84":-0.11982722580432892,
    //     "85":0.050935983657836914,
    //     "86":-0.02303437702357769,
    //     "87":-0.05322040989995003,
    //     "88":0.08873873949050903,
    //     "89":0.058895841240882874,
    //     "90":-0.07643429189920425,
    //     "91":0.19410088658332825,
    //     "92":-0.04180004447698593,
    //     "93":0.015306547284126282,
    //     "94":0.03445558249950409,
    //     "95":-0.030620291829109192,
    //     "96":-0.07560420036315918,
    //     "97":-0.05683383345603943,
    //     "98":-0.12784560024738312,
    //     "99":-0.10345037281513214,
    //     "100":0.005291204899549484,
    //     "101":-0.08221070468425751,
    //     "102":-0.07771434634923935,
    //     "103":0.06886012852191925,
    //     "104":-0.2600484788417816,
    //     "105":0.15244704484939575,
    //     "106":-0.009955108165740967,
    //     "107":-0.020395267754793167,
    //     "108":0.0022268034517765045,
    //     "109":0.13341166079044342,
    //     "110":-0.06316665560007095,
    //     "111":-0.01797570288181305,
    //     "112":0.15271863341331482,
    //     "113":-0.2706623077392578,
    //     "114":0.21582669019699097,
    //     "115":0.15326423943042755,
    //     "116":0.022105185315012932,
    //     "117":0.15550020337104797,
    //     "118":0.06836272776126862,
    //     "119":0.05058851093053818,
    //     "120":0.015313835814595222,
    //     "121":0.018477611243724823,
    //     "122":-0.14607009291648865,
    //     "123":-0.11125205457210541,
    //     "124":0.05701982602477074,
    //     "125":0.010917939245700836,
    //     "126":0.059368446469306946,
    //     "127": 0.05519556626677513
    // }`;

    //Ejemplo insertando descriptor
    // useEffect(() => {
    //   insertFaceData("34985578-2024", descriptorExample);
    // }, []);
  }
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
    paddingTop: StatusBar.currentHeight,
  },
});
