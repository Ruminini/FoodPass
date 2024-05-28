import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';

export default function ManageMembersGuests({ goTo }) {
  const [id, setId] = useState('');
  const [invalid, setInvalid] = useState('');

  const validateAndAction = () => {
    // Validación del formato del legajo
    if (!id.match(/^[0-9]{8}-[0-9]{4}$/)) {
      Toast.show({ 
        type: 'info', 
        text1: 'Formato de legajo incorrecto.',
        text2: 'Formato correcto: 8 dígitos - (guión) 4 dígitos.'
      });
      setInvalid('id');
      return ;
    }

    // Aquí puedes agregar la lógica para las acciones de "Dar de alta" y "Dar de baja"
    console.log('Realizar acción con el legajo:', id);
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
        <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={validateAndAction}>
          <Text style={styles.buttonText}>Dar de alta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]} onPress={validateAndAction}>
          <Text style={styles.buttonText}>Dar de baja</Text>
        </TouchableOpacity>
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
  button: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
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
});
