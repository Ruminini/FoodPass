import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import BackButton from '../components/BackButton';

export default function ProductForm({ goTo }) {
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [nombre, setNombre] = useState('');
  const [stock, setStock] = useState('');

  const handleCategoriaSelection = (selectedCategoria) => {
    // Si la categoría ya está seleccionada, deseleccionarla
    if (categoria === selectedCategoria) {
      setCategoria('');
    } else {
      setCategoria(selectedCategoria);
    }
  };

  const handleTipoSelection = (selectedTipo) => {
    // Si el tipo ya está seleccionado, deseleccionarlo
    if (tipo === selectedTipo) {
      setTipo('');
    } else {
      setTipo(selectedTipo);
    }
  };

  const handleAlta = () => {
    submitAction('Alta');
  };

  const handleBaja = () => {
    submitAction('Baja');
  };

  const handleActualizarStock = () => {
    submitAction('Actualización de stock');
  };

  const submitAction = (action) => {
    // Validación de los campos antes de enviar según la acción
    if (action === 'Alta') {
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
    } else if (action === 'Actualización de stock') {
      if (categoria === '' || nombre === '' || stock === '') {
        Toast.show({ 
          type: 'info', 
          text1: 'Categoria, Nombre y Stock son obligatorios.',
        });
        return;
      }
    }

    console.log('Realizar acción', action, 'para:', nombre);

    // Limpiar los campos después del envío
    setCategoria('');
    setTipo('');
    setNombre('');
    setStock('');

    // Mostrar mensaje de éxito
    Toast.show({ 
      type: 'success', 
      text1: `¡${action} concretada!`,
    });
  };

  const handleNombreChange = (text) => {
    // Validar que solo se ingresen letras
    if (/^[a-zA-Z\s]*$/.test(text) || text === '') {
      setNombre(text);
    }
  };

  const handleStockChange = (text) => {
    // Validar que solo se ingresen números
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
            placeholder="Ingrese el nombre del producto"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.title}>Stock</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleStockChange}
            value={stock}
            placeholder="Ingrese el stock disponible"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleAlta}>
            <Text style={styles.buttonText}>Dar de alta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.redButton]} onPress={handleBaja}>
            <Text style={styles.buttonText}>Dar de baja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={handleActualizarStock}>
            <Text style={styles.buttonText}>Actualizar stock</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BackButton onPress={() => goTo('Admin')} style={styles.backButton} />
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
    padding: 5,
    borderRadius: 5,
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
