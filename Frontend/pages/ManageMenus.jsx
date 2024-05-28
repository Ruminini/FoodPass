import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import BackButton from '../components/BackButton';
import { validateId, validatePassword, userStateValidator} from '../services/LoginValidator';

export default function ProductForm({ goTo }) {
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const handleCategoriaSelection = (selectedCategoria) => {
    setCategoria(categoria === selectedCategoria ? '' : selectedCategoria);
  };

  const handleTipoSelection = (selectedTipo) => {
    setTipo(tipo === selectedTipo ? '' : selectedTipo);
  };

  const validateAndAction = (action) => {
    if (action === 'Alta' || action === 'Actualización de stock') {
      if (categoria === '' || nombre === '' || stock === '') {
        Toast.show({ 
          type: 'info', 
          text1: 'Categoria, Nombre y Stock son obligatorios.',
        });
        return;
      }
    } else if (action === 'Baja') {
      if (categoria === '' || nombre === '') {
        Toast.show({ 
          type: 'info', 
          text1: 'Categoria y Nombre son obligatorios.',
        });
        return;
      }
    }
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
      console.log(`Realizar acción ${currentAction} a producto:`, nombre, categoria, stock);
      setModalVisible(false);
      setAdminUser('');
      setAdminPassword('');
      setCategoria('');
      setTipo('');
      setNombre('');
      setStock('');
      Toast.show({ 
        type: 'success', 
        text1: `¡${currentAction} concretada!`,
      });
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

  const handleNombreChange = (text) => {
    if (/^[a-zA-Z\s]*$/.test(text) || text === '') {
      setNombre(text);
    }
  };

  const handleStockChange = (text) => {
    if (/^\d+$/.test(text) || text === '') {
      setStock(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radio, categoria === 'Comida' && styles.selectedRadio]}
              onPress={() => handleCategoriaSelection('Comida')}>
              <Text style={styles.radioText}>Comida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, categoria === 'Bebida' && styles.selectedRadio]}
              onPress={() => handleCategoriaSelection('Bebida')}>
              <Text style={styles.radioText}>Bebida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, categoria === 'Postre' && styles.selectedRadio]}
              onPress={() => handleCategoriaSelection('Postre')}>
              <Text style={styles.radioText}>Postre</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radio, tipo === 'Vegano' && styles.selectedRadio]}
              onPress={() => handleTipoSelection('Vegano')}>
              <Text style={styles.radioText}>Vegano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, tipo === 'Vegetariano' && styles.selectedRadio]}
              onPress={() => handleTipoSelection('Vegetariano')}>
              <Text style={styles.radioText}>Vegetariano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, tipo === 'Celiaco' && styles.selectedRadio]}
              onPress={() => handleTipoSelection('Celiaco')}>
              <Text style={styles.radioText}>Celiaco</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.title}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleNombreChange}
            value={nombre}
            placeholder="Milanesa con pure"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.title}>Stock</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleStockChange}
            value={stock}
            placeholder="10"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={() => validateAndAction('Alta')}>
            <Text style={styles.buttonText}>Dar de alta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.redButton]} onPress={() => validateAndAction('Baja')}>
            <Text style={styles.buttonText}>Dar de baja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => validateAndAction('Actualización de stock')}>
            <Text style={styles.buttonText}>Actualizar stock</Text>
          </TouchableOpacity>
        </View>
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
  label: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'right',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  radio: {
    backgroundColor: '#666666',
    padding: 7,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  selectedRadio: {
    backgroundColor: '#222222',
  },
  radioText: {
    color: 'white',
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
  buttonGroup: {
    flexDirection: 'column',
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
  greenButton: {
    backgroundColor: '#28a745',
  },
  redButton: {
    backgroundColor: '#dc3545',
  },
  blueButton: {
    backgroundColor: '#007bff',
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
