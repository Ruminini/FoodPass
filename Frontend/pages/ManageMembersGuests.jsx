import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';
import { validateId, validateTypeUser, validatePassword, userStateValidator } from '../services/LoginValidator';
import { validMemberRegister, validMemberDelete } from '../services/ValidMemberActions';

export default function ManageMembersGuests({ goTo }) {
  const [id, setId] = useState('');
  const [nameMember, setNameMember] = useState('');
  const [lastnameMember, setLastnameMember] = useState('');
  const [invalid, setInvalid] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const resetFields = () => {
    setId('');
    setNameMember('');
    setLastnameMember('');
    setAdminUser('');
    setAdminPassword('');
    setCurrentAction('');
    setModalVisible(false);
  };

  const handleIdChange = (text) => {
    setId(text);
    if (/^[0-9]{8}-[0-9]{4}$/.test(text)) {
      setInvalid('');
    } else {
      setInvalid('id');
    }
  };

  const handleNameChange = (text) => {
    if (/^[a-zA-Z\s]*$/.test(text) || text === '') {
      setNameMember(text);
    }
  };

  const handleLastnameChange = (text) => {
    if (/^[a-zA-Z\s]*$/.test(text) || text === '') {
      setLastnameMember(text);
    }
  };

  const validateAndAction = async (action) => {
    if (!/^[0-9]{8}-[0-9]{4}$/.test(id)) {
      Toast.show({
        type: 'info',
        text1: 'Formato de legajo incorrecto.',
        text2: 'Formato correcto: 8 dígitos - (guión) 4 dígitos.'
      });
      setInvalid('id');
      return;
    }

    // Legajos reservados para administradores
    if (id.endsWith('-0000')) {
      Toast.show({
        type: 'info',
        text1: 'Legajo reservado para admin.',
        text2: 'Los legajos que terminan en -0000 son administradores.'
      });
      return;
    }

    if (!nameMember.trim() || !lastnameMember.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Nombre y apellido son campos requeridos.',
      });
      return;
    }

    setCurrentAction(action);
    setModalVisible(true);
  };

  const confirmAction = async () => {
    const adminUserIsValid = await validateId(adminUser);

    if (adminUserIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Ingrese usuario correcto.',
      });
      return;
    }

    const adminTypeUserIsValid = await validateTypeUser(adminUser);
    if (adminTypeUserIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'El usuario no es admin.',
      });
      return;
    }

    const adminPasswordIsValid = await validatePassword(adminUser, adminPassword);
    if (adminPasswordIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Ingrese contraseña correcta.',
      });
      return;
    }

    const adminStateIsValid = await userStateValidator(adminUser);
    if (adminStateIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Usuario administrador inactivo.',
      });
      return;
    }

    try {
      console.log(`Realizar acción ${currentAction} con el legajo:`, id);

      if (currentAction === 'alta') {
        try {
          const validMemberRegistered = await validMemberRegister(id, nameMember, lastnameMember);

          if (validMemberRegistered) {
            Toast.show({
              type: 'info',
              text1: '¡Alta de miembro!',
            });
            resetFields();
            return false;
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error en el alta del miembro.',
            });
            resetFields();
            return false;
          }
        } catch (error) {
          console.error(error);
          return false;
        }
      } else if (currentAction === 'baja') {
        try {
          const validMemberDeleted = await validMemberDelete(id);

          if (validMemberDeleted) {
            Toast.show({
              type: 'info',
              text1: '¡Baja de miembro!',
            });
            resetFields();
            return false;
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error en la baja del miembro.',
            });
            resetFields();
            return false;
          }
        } catch (error) {
          console.error(error);
          return false;
        }
      } else {
        console.log('Acción no reconocida.');
      }
      Toast.show({
        type: 'success',
        text1: '¡Acción realizada correctamente!'
      });
      resetFields();
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
          onChangeText={handleIdChange}
          value={id}
          placeholder="12345678-4321"
          keyboardType="numeric"
        />
        <Text style={styles.title}>Nombre</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleNameChange}
          value={nameMember}
          placeholder="Leonel"
        />
        <Text style={styles.title}>Apellido</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleLastnameChange}
          value={lastnameMember}
          placeholder="Messi"
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
                keyboardType="default"
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
              style={[styles.button, { backgroundColor: '#6c757d' }]}
              onPress={confirmAction}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#6c757d' }]}
              onPress={resetFields}>
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
