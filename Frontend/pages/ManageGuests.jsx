import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Alert } from "react-native";
import BackButton from "../components/BackButton";
import MenuButton from "../components/MenuButton";
import Toast from "react-native-toast-message";
import { insertGuest } from "../service_db/DBQuerys";

export default function ManageGuests({ goTo }) {
  const [expiration, onChangeExpiration] = useState(1);
  const [id, onChangeId] = useState();
  const [invalid, setInvalid] = useState("");

  const validateAndRegister = async () => {
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
    //TODO: Habria q validar identidad del admin con el modal de luca

    // Registrar miembro en la base de datos
		let password
    try {
      password = await insertGuest(id, expiration).catch((error) => {
        Toast.show({
          type: "error",
          text1: "Ocurrió un error inesperado.",
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
			[{ text: "OK", onPress: () => goTo("Admin") }]
		);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={[styles.title, invalid === "DNI" && { color: "red" }]}>
          Legajo
        </Text>
				{/* TODO: Falta un selector de expiración */}
        <TextInput
          style={styles.input}
          onChangeText={onChangeId}
          value={id}
          placeholder="12345678"
          keyboardType="numeric"
        />
        <MenuButton
          text="Registrar"
          onPress={validateAndRegister}
          style={{ height: 75, width: 300, alignSelf: "center" }}
        />
      </View>
      <BackButton onPress={() => goTo("Admin")} />
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
  }
});
