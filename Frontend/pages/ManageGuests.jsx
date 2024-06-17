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
import {
  activeUserMember,
  getUserById,
  inactiveUserMember,
  insertGuest,
} from "../service_db/DBQuerys";
import AdminModal from "../components/AdminModal";
import { sendGuestEmail } from "../services/Api";

export default function ManageGuests({ before, data }) {
  const user = data?.user;
  const updating = user?.member_code ? true : false;
  const [expiration, setExpiration] = useState(1);
  const [id, onChangeId] = useState(user?.member_code.slice(0, 8) || "");
  const [mail, onChangeMail] = useState(user?.mail || "");
  const [invalid, setInvalid] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [after, setAfter] = useState("");

  const handleAfter = () => {
    after == "register" ? register() : setActive();
  };

  const validate = async () => {
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
    // Mail no obligatorio
    if (
      mail &&
      !mail.match(/^[\w-]+([\w\.-])*[\w-]@([\w-]+\.)*[\w-]{2,4}$/gm)
    ) {
      Toast.show({
        type: "info",
        text1: "Formato de Mail incorrecto.",
      });
      setInvalid("mail");
      return false;
    }
    const registered = await getUserById(`${id}-9999`);
    if (registered.length > 0) {
      Toast.show({
        type: "error",
        text1: "DNI ya registrado",
      });
      return false;
    }
    setAfter("register");
    setModalVisible(true);
  };

  const register = async () => {
    let password = await insertGuest(id, expiration).catch((error) => {
      Toast.show({
        type: "error",
        text1: "Error al intentar registrar el invitado",
      });
      console.log("Error al intentar registrar el invitado.", error);
      return false;
    });
    console.log("Invitado registrado.");
    Alert.alert(
      "¡Registro exitoso!",
      "DNI: " + id + "\nContraseña: " + password,
      [{ text: "OK" }]
    );
    if (mail != "" && (await sendGuestEmail(mail, id, password))) {
      Toast.show({
        type: "success",
        text1: "Mail enviado correctamente.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "El invitado no ha sido notificado",
        text2: "Deberas notificarle manualmente.",
      });
    }
    before();
  };

  const handleUpdateState = () => {
    setAfter("updateState");
    setModalVisible(true);
  };

  const setActive = () => {
    console.log("setting active");
    user.state == "A"
      ? inactiveUserMember(`${id}-9999`)
      : activeUserMember(`${id}-9999`);
    before();
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
          readOnly={updating}
        />
        <Text style={[styles.title, invalid === "mail" && { color: "red" }]}>
          Correo
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeMail}
          value={mail}
          placeholder="nombre@mail.com"
          keyboardType="email-address"
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
          <Text style={styles.expText}>
            {expiration == 1 ? "dia  " : "dias"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={validate}
          style={[styles.button, { backgroundColor: "#007bff" }]}
        >
          <Text style={styles.buttonText}>
            {updating ? "Actualizar" : "Registrar"}
          </Text>
        </TouchableOpacity>
        {updating && (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: user.state == "A" ? "#dc3545" : "#28a745" },
            ]}
            onPress={handleUpdateState}
          >
            <Text style={styles.buttonText}>
              {user.state == "A" ? "Dar de baja" : "Dar de alta"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <AdminModal
        visible={modalVisible}
        hide={() => setModalVisible(false)}
        after={handleAfter}
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
