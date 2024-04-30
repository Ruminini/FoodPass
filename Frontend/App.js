import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useState, useRef } from 'react';
import FaceScan from './pages/FaceScan';
import MainMenu from './pages/MainMenu';
import ConfigMenu from './pages/ConfigMenu'
import FoodPicker from './pages/FoodPicker';
import Register from './pages/Register';

export default function App() {
  
  return (
      <View style={styles.container}>
        <FaceScan />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#EEE',
      width: '100%',
      position: 'relative',
      paddingTop: StatusBar.currentHeight
  }
});
