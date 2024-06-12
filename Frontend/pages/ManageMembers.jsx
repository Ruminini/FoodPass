import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';
import { validMemberRegister, validMemberDelete } from '../services/ValidMemberActions';
import AdminModal from '../components/AdminModal';

export default function ManageMembers({ before, data }) {
  const [id, setId] = useState(data?.user?.code || '');
  const [nameMember, setNameMember] = useState(data?.user?.name || '');
  const [lastnameMember, setLastnameMember] = useState(data?.user?.last_name || '');
  const [invalid, setInvalid] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState('');

  const resetFields = () => {
    setModalVisible(false);
    before();
  };

  const handleIdChange = (text) => {
    setId(text);
    if (/^[0-9]{8}-[0-9]{4}$/.test(text)) {
      setInvalid('');
    } else {
      setInvalid('id');
    }
  };

  const validateAndAction = async (action) => {
    // Validar el formato del ID
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
        text2: 'Aquellos que terminan en -0000 son admin.'
      });
      return;
    }
  
    console.log(action)

    // Validar que nombre y apellido no estén vacíos solo en la acción de "alta"
    if (action === 'alta' && (!nameMember.trim() || !lastnameMember.trim())) {
      Toast.show({
        type: 'info',
        text1: 'Nombre y apellido son campos requeridos.',
      });
      return;
    } else if (action === 'alta') {
      // Limpiar los espacios adicionales solo en la acción de "alta"
      const cleanedName = nameMember.replace(/\s{2,}/g, ' ').trim();
      const cleanedLastname = lastnameMember.replace(/\s{2,}/g, ' ').trim();

      // Validar que nombre y apellido no contengan números ni signos de puntuación solo en la acción de "alta"
      if (!/^[a-zA-Z\s]+$/.test(cleanedName) || !/^[a-zA-Z\s]+$/.test(cleanedLastname)) {
        Toast.show({
          type: 'info',
          text1: 'Nombre y apellido solo pueden contener letras.',
        });
        return;
      }
    }

    setCurrentAction(action);
    setModalVisible(true);
  };

  const confirmAction = async () => {
    try {
      console.log(`Realizar acción ${currentAction} con el legajo:`, id);
  
      if (currentAction === 'alta') {
        try {
          const validMemberRegistered = await validMemberRegister(id, nameMember, lastnameMember);
  
          resetFields();
  
          return validMemberRegistered;
        } catch (error) {
          console.error(error);
          resetFields();
          return false;
        }
      } else if (currentAction === 'baja') {
        try {
          const validMemberDeleted = await validMemberDelete(id);
  
          resetFields();
  
          return validMemberDeleted;
        } catch (error) {
          console.error(error);
          resetFields();
          return false;
        }
      }
    } catch (error) {
      console.error('Error en la validación del usuario:', error);
      Toast.show({
        type: 'error',
        text1: '¡Error de validación!',
        text2: 'Ocurrió un error al validar las credenciales del administrador.'
      });
      resetFields();
      return false;
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
          onChangeText={setNameMember}
          value={nameMember}
          placeholder="Leonel"
        />
        <Text style={styles.title}>Apellido</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLastnameMember}
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
      <AdminModal after={confirmAction} visible={modalVisible} hide={() => setModalVisible(false)} />
      <BackButton onPress={before} style={styles.backButton} />
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
});
