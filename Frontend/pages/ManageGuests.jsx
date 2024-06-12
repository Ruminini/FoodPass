import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackButton from "../components/BackButton";
import Toast from "react-native-toast-message";
import { insertGuest } from "../service_db/DBQuerys";
import AdminModal from "../components/AdminModal";

export default function ManageGuests({ before, data }) {
  console.log(data)
  const [expiration, setExpiration] = useState(1);
  const [id, onChangeId] = useState(data?.user?.member_code.slice(0, 8) || "");
  const [invalid, setInvalid] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const validate = () => {
    // Validación del formato del legajo
    if (!id.match(/^[0-9]{8}$/)) {
      Toast.show({
        type: "info",
        text1: "Formato de DNI incorrecto.",
        text2: "Formato correcto: 8 dígitos.",
      });
      setInvalid("id");
      return false;
    }
    setModalVisible(true);
  };

  const register = async () => {
    // Registrar miembro en la base de datos
    let password;
    try {
      password = await insertGuest(id, expiration).catch((error) => {
        Toast.show({
          type: "error",
          text1: "Error al intentar registrar el invitado",
        });
        console.log("Error al intentar registrar el invitado.");
        return false;
      });
    } catch (error) {
      console.error(error);
      return false;
    }
    console.log("Invitado registrado.");
    Alert.alert(
      "¡Registro exitoso!",
      "DNI: " + id + "\nContraseña: " + password,
      [{ text: "OK" }]
    );
    onChangeId("");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={[styles.title, invalid === "DNI" && { color: "red" }]}>
          DNI
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeId}
          value={id}
          placeholder="12345678"
          keyboardType="numeric"
        />
        <View style={styles.expiration}>
          <Text style={styles.expText}>Validez:</Text>
          {[1, 3, 5, 7, 14, 30].map((n) => (
            <Text
              key={n}
              style={[styles.expDay, expiration === n && styles.selected]}
              onPress={() => setExpiration(n)}
            >
              {n}
            </Text>
          ))}
          <Text style={styles.expText}>{expiration == 1 ? "dia  " : "dias"}</Text>
        </View>
        <TouchableOpacity
          onPress={validate}
          style={[styles.button, { backgroundColor: "#28a745" }]}
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
      <AdminModal
        visible={modalVisible}
        hide={() => setModalVisible(false)}
        after={register}
      />
      <BackButton onPress={before} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    width: "100%",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 25,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignSelf: "flex-start",
    padding: 5,
    paddingHorizontal: 15,
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: "#CCC",
  },
  input: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
    borderTopLeftRadius: 0,
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  expiration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    width: "100%",
    elevation: 1,
  },
  expText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  expDay: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2,
    color: "#CCC",
  },
  selected: {
    backgroundColor: "#CCC",
    color: "#000",
  },
});
