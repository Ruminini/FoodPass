import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';
import { validateId, validateTypeUser, validatePassword, userStateValidator} from '../services/LoginValidator';

export default function ManageMembersGuests({ goTo }) {
  const [id, setId] = useState('');
  const [invalid, setInvalid] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const validateAndAction = (action) => {
    // Validación del formato del legajo
    if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
      Toast.show({ 
        type: 'info', 
        text1: 'Formato de legajo incorrecto.',
        text2: 'Formato correcto: 8 dígitos - (guión) 4 dígitos.'
      });
      setInvalid('id');
      return;
    }

    // Guardar la acción actual (alta o baja) y mostrar el modal
    setCurrentAction(action);
    setModalVisible(true);
  };

  const confirmAction = async () => {
    // Validar credenciales del admin
    const adminUserIsValid = await validateId(adminUser);
    
    if (adminUserIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Usuario no existe.',
      });
      return; // Salir de la función si el usuario no es válido
    }

    // Validar usuario admin
    const adminTypeUserIsValid = await validateTypeUser(adminUser)
    if (adminTypeUserIsValid === false){
      Toast.show({
        type: 'error',
        text1: 'El usuario no es admin.',
      });
      return; // Salir de la función si el usuario no es admin
    }

    // Validación de la contraseña en la base de datos
    const adminPasswordIsValid = await validatePassword(adminUser, adminPassword);
    if (adminPasswordIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña incorrecta.',
      });
      return; // Salir de la función si la contraseña no es válida
    }

    // Validación del estado del usuario
    const adminStateIsValid = await userStateValidator(adminUser);
    if (adminStateIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Usuario inactivo.',
      });
      return; // Salir de la función si el estado del usuario no es válido
    }

    try {
      // Si todas las validaciones son exitosas, realizar la acción correspondiente
      console.log(`Realizar acción ${currentAction} con el legajo:`, id);
      setModalVisible(false);
      setAdminUser('');
      setAdminPassword('');
      Toast.show({ 
        type: 'success', 
        text1: '¡Acción realizada correctamente!'
      });
    } catch (error) {
      console.error('Error en la validación del usuario:', error);
      Toast.show({ 
        type: 'error', 
        text1: '¡Error de validación!',
        text2: 'Ocurrió un error al validar las credenciales del administrador.'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, invalid === 'id' && { color: 'red' }]}>Legajo</Text>
        <TextInput
          style={styles.input}
          onChangeText={setId}
          value={id}
          placeholder="12345678-4321"
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#28a745' }]} 
          onPress={() => validateAndAction('alta')}>
          <Text style={styles.buttonText}>Dar de alta</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#dc3545' }]} 
          onPress={() => validateAndAction('baja')}>
          <Text style={styles.buttonText}>Dar de baja</Text>
        </TouchableOpacity>
      </View>
      <BackButton onPress={() => goTo('Admin')} style={styles.backButton} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Credenciales de Admin</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setAdminUser}
                value={adminUser}
                placeholder="Usuario"
                keyboardType="default"
              />
              <TextInput
                style={styles.input}
                onChangeText={setAdminPassword}
                value={adminPassword}
                placeholder="Contraseña"
                secureTextEntry={true}
              />
            </View>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#ffcc00' }]} 
              onPress={confirmAction}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#6c757d' }]} 
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    padding: 25,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 25,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignSelf: 'flex-start',
    padding: 5,
    paddingHorizontal: 15,
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  input: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    borderTopLeftRadius: 0,
    fontSize: 20,
    marginBottom: 20,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 0, 
    left: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});
