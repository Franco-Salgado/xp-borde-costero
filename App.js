import React, { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [temperatura, setTemperatura] = useState(null);
  const [humedad, setHumedad] = useState(null);
  const [dic, setDic] = useState({ sensor1: {t: [10, 12], h: [20, 8]}, sensor2: {s: [4, 6], a: [99, 98]} });

  // AsyncStorage con objetos
  const buttonSave = () => {
    dic.sensor1.t.push(temperatura);
    dic.sensor1.h.push(humedad);
    AsyncStorage.setItem('objeto', JSON.stringify(dic))
    .then(json => alert('Objeto guardado'))
    .catch(error => alert('No hay objeto que guardar'));
  }
  const buttonShow = () => {
    AsyncStorage.getItem('objeto')
    .then(req => JSON.parse(req))
    .then(json => alert('Objeto mostrado'))
    .catch(error => alert('No hay objeto que mostrar'));
  }

  return (
    <View style={styles.containerV}>
      <Text>Sensor 1</Text>
      <View style={styles.containerH}>
        <TextInput
          style={styles.input}
          onChangeText={setTemperatura}
          value={temperatura}
          placeholder="T"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          onChangeText={setHumedad}
          value={humedad}
          placeholder="H"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.containerH}>
        <TouchableOpacity
          style={styles.button}
          onPress={buttonSave}
        >
          <Text>Save</Text> 
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={buttonShow}
        >
          <Text>Show</Text> 
        </TouchableOpacity>
      </View>
      <Text style={{margin:10}}>
        {JSON.stringify(dic)}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  containerV: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerH: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 5
  }
});




// ======================================================================================================
// AsyncStorage con strings
// const botonSave = () => {
//   if (temperatura) {
//     AsyncStorage.setItem('string', temperatura);
//     setTemperatura('');
//     alert('String guardado');
//   } else {
//     alert('No hay string que guardar');
//   }
// }
// const botonShow = () => {
//   AsyncStorage.getItem('string').then((value) => setValue(value));
// }