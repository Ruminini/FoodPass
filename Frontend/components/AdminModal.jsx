import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  validateId,
  validateTypeUser,
  validatePassword,
  userStateValidator,
} from "../services/LoginValidator";
import { createLoginLog } from "../service_db/DBQuerys";

export default function AdminModal({ hide, after, visible }) {
  const [adminUser, setAdminUser] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const resetFields = () => {
    setAdminUser("");
    setAdminPassword("");
    hide();
  };

  const confirmAction = async () => {
    const adminUserIsValid = await validateId(adminUser);

    if (adminUserIsValid === false) {
      Toast.show({
        type: "error",
        text1: "Ingrese usuario correcto.",
      });
      return;
    }

    const adminTypeUserIsValid = await validateTypeUser(adminUser);
    if (adminTypeUserIsValid === false) {
      Toast.show({
        type: "error",
        text1: "El usuario no es admin.",
      });
      return;
    }

    const adminPasswordIsValid = await validatePassword(
      adminUser,
      adminPassword
    );
    if (adminPasswordIsValid === false) {
      Toast.show({
        type: "error",
        text1: "Ingrese contraseña correcta.",
      });
      return;
    }

    const adminStateIsValid = await userStateValidator(adminUser);
    if (adminStateIsValid === false) {
      Toast.show({
        type: "error",
        text1: "Usuario administrador inactivo.",
      });
      return;
    }

    resetFields();
    createLoginLog(adminUser);
    after();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={resetFields}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Credenciales de Admin</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setAdminUser}
              value={adminUser}
              placeholder="00000000-0000"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              onChangeText={setAdminPassword}
              value={adminPassword}
              placeholder="••••••••••"
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6c757d" }]}
            onPress={confirmAction}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6c757d" }]}
            onPress={resetFields}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
    borderTopLeftRadius: 0,
    fontSize: 20,
    marginBottom: 20,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});
