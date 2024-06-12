import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import BackButton from '../components/BackButton';
import { decideAction } from '../services/MenuActions';
import AdminModal from '../components/AdminModal';

export default function ProductForm({ data, before }) {
  const food = data.food || {};
  const receivedFood = Object.keys(data.food).length > 0;
  const [category, setCategory] = useState(food.type_code || '1');
  const [selectedTypes, setSelectedTypes] = useState(food.restrictions ? [...food.restrictions] : []);
  const [name, setName] = useState(food.name || '');
  const [description, setDescription] = useState(food.description || '');
  const [stock, setStock] = useState('' + (food.stock || ''));
  const [pointReOrder, setPointReOrder] = useState('' + (food.minimum_amount || ''));
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState('');


  const handleTypeSelection = (selectedType) => {
    // Verificar si el tipo ya está seleccionado
    if (selectedTypes.includes(selectedType)) {
      // Si está seleccionado, quitarlo de la lista de tipos seleccionados
      setSelectedTypes(selectedTypes.filter(type => type !== selectedType));
    } else {
      // Si no está seleccionado, añadirlo a la lista de tipos seleccionados
      setSelectedTypes([...selectedTypes, selectedType]);
    }
  };

  const validateAndAction = (action) => {
    if (action === 'Alta' || action === 'Update') {
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
  
    // Validar que nombre y descripción cumplan con los criterios
    if (!/^[a-zA-Z\sñÑ]+$/.test(cleanedName)) {
      Toast.show({
        type: 'info',
        text1: 'El nombre no puede contener números.',
      });
      return;
    }
  
    if (!/^[a-zA-Z\s.,!?¿¡ñÑ]+$/.test(cleanedDescription)) {
      Toast.show({
        type: 'info',
        text1: 'La descripción no puede contener números.',
      });
      return;
    }

    setCurrentAction(action);
    setModalVisible(true);
  };

  const confirmAction = async () => {
    try {
      // Si todas las validaciones son exitosas, realizar la acción correspondiente
      console.log(`Realizar acción ${currentAction} a producto:`, name, category, selectedTypes, description, stock, pointReOrder, food.id);
      const actionResult = await decideAction(currentAction, name, category, selectedTypes, description, stock, pointReOrder, food.id);
      setModalVisible(false);
    
      if (actionResult.success) {
        Toast.show({
            type: 'info',
            text1: actionResult.message,
        });
        before();
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
              style={[styles.radio, category == 1 && styles.selectedRadio]}
              onPress={() => setCategory(1)}>
              <Text style={styles.radioText}>Comida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, category == 2 && styles.selectedRadio]}
              onPress={() => setCategory(2)}>
              <Text style={styles.radioText}>Bebida</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, category == 3 && styles.selectedRadio]}
              onPress={() => setCategory(3)}>
              <Text style={styles.radioText}>Postre</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Tipo (opcional)</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radio, selectedTypes.includes(1) && styles.selectedRadio]}
              onPress={() => handleTypeSelection(1)}>
              <Text style={styles.radioText}>Vegano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, selectedTypes.includes(2) && styles.selectedRadio]}
              onPress={() => handleTypeSelection(2)}>
              <Text style={styles.radioText}>Vegetariano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radio, selectedTypes.includes(3) && styles.selectedRadio]}
              onPress={() => handleTypeSelection(3)}>
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
            placeholder="50"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.title}>Punto de re-orden</Text>
          <TextInput
            style={styles.input}
            onChangeText={handlePointReOrderChange}
            value={pointReOrder}
            placeholder="10"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={() => validateAndAction(receivedFood ? 'Update' : 'Alta')}>
            <Text style={styles.buttonText}>{receivedFood ? 'Actualizar' : 'Cargar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.redButton]} onPress={() => validateAndAction('Baja')}>
            <Text style={styles.buttonText}>Dar de baja</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BackButton onPress={before} style={styles.backButton} />
      <AdminModal after={confirmAction} visible={modalVisible} hide={() => setModalVisible(false)} />
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
});
