import React, { useContext, createContext, useState, useEffect } from 'react';
import { View, Button, Text, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const key_sensor1 = '@Sensor1'
  const key_sensor2 = '@Sensor2'
  const [value, setValue] = useState("");

  const [temp, setTemp] = useState(23);
  const [hum, setHum] = useState(5);
  const [pre, setPre] = useState(1601);
  const [temp2, setTemp2] = useState(18);
  const [uv, setUv] = useState(2);
  var sensor1 = {}
  var sensor2 = {}

  const setItem = async (key, dato) => {
    try {
      await AsyncStorage.setItem(key, dato);
      console.log(dato)
      alert('Dato almacenado');
    } catch(e) {
      alert('Error al almacenar');
    }
  }

  const getItem = async (key) => {
    try {
      setValue(await AsyncStorage.getItem(key));
      console.log('   VALUE: ', await AsyncStorage.getItem(key));
      alert('Dato recuperado');
    } catch(e) {
      alert('Error al recuperar');
    }
  }

  const readSensor1 = () => {
    // Toda la conexión con el sensor 1
    // ...
    // Lectura de los datos
    sensor1['t'] = temp;
    sensor1['h'] = hum;
    sensor1['p'] = pre;
  }

  useEffect(() => {
    getItem(key_sensor1);
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Tomar muestra" onPress={() => readSensor1()} />
      <Button title="Almacenar muestra" onPress={() => setItem(key_sensor1, JSON.stringify(sensor1))} />
    </View>
  );
};

export default () => (
  <App />
);