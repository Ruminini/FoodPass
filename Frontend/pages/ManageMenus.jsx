import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import BackButton from '../components/BackButton';
import { validateId, validateTypeUser, validatePassword, userStateValidator } from '../services/LoginValidator';
import { decideAction } from '../services/MenuActions';

export default function ProductForm({ goTo }) {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [pointReOrder, setPointReOrder] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const handleCategoriaSelection = (selectedCategory) => {
    setCategory(category === selectedCategory ? '' : selectedCategory);
  };

  const handleTipoSelection = (selectedType) => {
    setType(type === selectedType ? '' : selectedType);
  };

  const validateAndAction = (action) => {
    if (action === 'Alta'){
      if (category === '' || name === '' || setDescription === '' || stock === '' || pointReOrder === '') {
        Toast.show({ 
          type: 'info', 
          text1: 'Todos los campos son obligatorios.',
        });
        return;
      }
      // Convertir stock a una cadena y verificar la longitud
      const stockString = String(stock);
      if (stockString.length > 4) {
        Toast.show({ 
          type: 'info', 
          text1: 'Cantidad de stock supera el limite (4 dígitos).',
        });
        return;
      }
    } else if (action === 'Actualización de stock') {
      // Verificar si name o stock están vacíos
      if (name === '' || stock === '') {
        Toast.show({ 
          type: 'info', 
          text1: 'Nombre y stock son obligatorios.',
        });
        return;
      }
      // Convertir stock a una cadena y verificar la longitud
      const stockString = String(stock);
      if (stockString.length > 4) {
        Toast.show({ 
          type: 'info', 
          text1: 'Cantidad de stock supera el limite (4 dígitos).',
        });
        return;
      }
    } else if (action === 'Baja') {
      if (name === '') {
        Toast.show({ 
          type: 'info', 
          text1: 'Nombre es obligatorio.',
        });
        return;
      }
    }

    // Validar que nombre y descripción no estén vacíos
    if (!name.trim() || !description.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Nombre y descripción son campos requeridos.',
      });
      return;
    }
  
    // Limpiar los espacios adicionales
    const cleanedName = name.replace(/\s{2,}/g, ' ').trim();
    const cleanedDescription = description.replace(/\s{2,}/g, ' ').trim();

    // Validar que nombre y descripción no contengan números ni signos de puntuación
    if (!/^[a-zA-Z\s]+$/.test(cleanedName) || !/^[\w\s,.]+$/.test(cleanedDescription)) {
      Toast.show({
        type: 'info',
        text1: 'Nombre y descripción solo pueden contener letras.',
      });
      return;
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
        text1: 'Ingrese usuario correcto.',
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
        text1: 'Ingrese contraseña correcta.',
      });
      return; // Salir de la función si la contraseña no es válida
    }

    // Validación del estado del usuario
    const adminStateIsValid = await userStateValidator(adminUser);
    if (adminStateIsValid === false) {
      Toast.show({
        type: 'error',
        text1: 'Usuario administrador inactivo.',
      });
      return; // Salir de la función si el estado del usuario no es válido
    }

    try {
      // Si todas las validaciones son exitosas, realizar la acción correspondiente
      console.log(`Realizar acción ${currentAction} a producto:`, name, category, type, description, stock, pointReOrder);
      const actionResult = await decideAction(currentAction, name, category, type, description, stock, pointReOrder);
      setModalVisible(false);
      setAdminUser('');
      setAdminPassword('');
      setCategory('');
      setType('');
      setName('');
      setDescription('');
      setStock('');
      setPointReOrder('');
    
      if (actionResult.success) {
        Toast.show({
            type: 'info',
            text1: actionResult.message,
        });
      } else {
          // Hubo un error al realizar la acción
          Toast.show({
              type: 'error',
              text1: actionResult.message,
          });
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error en la ejecución de la acción:', error);
    }
  }

  const handleStockChange = (text) => {
    if (/^[1-9]\d*$/.test(text) || text === '') {
      setStock(text);
    }
  };
  
  const handlePointReOrderChange = (text) => {
    if (/^[1-9]\d*$/.test(text) || text === '') {
      setPointReOrder(text);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radio, category === 'Comida' && styles.selectedRadio]}
              onPress={() => handleCategoriaSelection('Comida')}>
              <Text style={styles.radioText}>Comida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, category === 'Bebida' && styles.selectedRadio]}
              onPress={() => handleCategoriaSelection('Bebida')}>
              <Text style={styles.radioText}>Bebida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, category === 'Postre' && styles.selectedRadio]}
              onPress={() => handleCategoriaSelection('Postre')}>
              <Text style={styles.radioText}>Postre</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Tipo (opcional)</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radio, type === 'Vegano' && styles.selectedRadio]}
              onPress={() => handleTipoSelection('Vegano')}>
              <Text style={styles.radioText}>Vegano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, type === 'Vegetariano' && styles.selectedRadio]}
              onPress={() => handleTipoSelection('Vegetariano')}>
              <Text style={styles.radioText}>Vegetariano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, type === 'Celiaco' && styles.selectedRadio]}
              onPress={() => handleTipoSelection('Celiaco')}>
              <Text style={styles.radioText}>Celiaco</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.title}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Milanesa con pure"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.title}>Descripción</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            placeholder="Milanesa de carne con pure de papa"
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
        <View style={styles.field}>
          <Text style={styles.title}>Punto de re-orden</Text>
          <TextInput
            style={styles.input}
            onChangeText={handlePointReOrderChange}
            value={pointReOrder}
            placeholder="50"
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
