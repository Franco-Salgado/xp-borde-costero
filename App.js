import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';

const App = () => {
  // Variables y constantes
  const key_sensor1 = '@Sensor1';
  const key_sensor2 = '@Sensor2';
  const [value, setValue] = useState();

  const [temp, setTemp] = useState();
  const [hum, setHum] = useState();
  const [pre, setPre] = useState();
  const [temp2, setTemp2] = useState();
  const [uv, setUv] = useState();

  // var sensor1 = {'t':[], 'h':[], 'p':[]}
  var sensor1 = [];
  var sensor2 = {};
  var dia = 2;

  // Funciones de memoria
  const setItem = async (key, dato) => {
    try {
      await AsyncStorage.setItem(key, dato);
      console.log('SET: ', dato)
      alert('Dato almacenado');
    } catch(e) {
      alert('Error al almacenar');
    }
  }

  const getItem = async (key) => {
    try {
      setValue(await AsyncStorage.getItem(key));
      console.log('GET: ', await AsyncStorage.getItem(key));
    } catch(e) {
      alert('Error al recuperar');
    }
  }

  // Funciones de los botones
  const readSensor1 = () => {
    // Toda la conexión con el sensor 1
    // ...
    // Lectura de los datos
    temperatura = Math.floor(Math.random() * 273)
    setTemp(temperatura);
    humedad = Math.floor(Math.random() * 100)
    setHum(humedad);
    presion = Math.floor(Math.random() * 2000)
    setPre(presion);
  }

  const storeSensor1 = () => {
    getItem(key_sensor1);
    sensor1 = JSON.parse(value);
    sensor1.push({'f':dia, 't':temp, 'h':hum, 'p':pre});
    console.log('SENSOR: ', sensor1);
    setItem(key_sensor1, JSON.stringify(sensor1));
  }

  // Construcción de la tabla
  // const objectMap = (obj, fn) => {
  //   Object.fromEntries(
  //     Object.entries(obj).map(
  //       ([k, v], i) => [k, fn(v, k, i)]
  //     )
  //   )
  // }
  

  useEffect(() => {
    getItem(key_sensor1);
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'black'} />
        <View style={styles.data}>
          <Button title="Tomar muestra" onPress={() => readSensor1()} />
          {(temp && hum && pre) &&
            <Text>{temp}[°C]   {hum}%   {pre}[Pa]</Text>}
          <Button title="Almacenar muestra" onPress={() => storeSensor1()} />
        </View>
        <ScrollView style={styles.scroll}>
          {(value) &&
            <DataTable style={styles.table}>
              <DataTable.Header style={styles.header}>
                <DataTable.Title>Fecha</DataTable.Title>
                <DataTable.Title>Temperatura [°C]</DataTable.Title>
                <DataTable.Title>Humedad [%]</DataTable.Title>
                <DataTable.Title>Presión [Pa]</DataTable.Title>
              </DataTable.Header>
              {
                JSON.parse(value).map(valor => {
                  return (
                    <DataTable.Row key={valor.f}>
                      <DataTable.Cell numeric>{valor.f}</DataTable.Cell>
                      <DataTable.Cell numeric>{valor.t}</DataTable.Cell>
                      <DataTable.Cell numeric>{valor.h}</DataTable.Cell>
                      <DataTable.Cell numeric>{valor.p}</DataTable.Cell>
                    </DataTable.Row>
                  )
                })
              }
            </DataTable>
          }
        </ScrollView>
    </SafeAreaView>
  );
};

export default () => (
  <App />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  data: {
    paddingVertical: 25
  },
  scroll: {
    height: 100,
    alignSelf:'stretch',
    paddingHorizontal: 25
  },
  table: {
    borderStartColor: 'solid',
    borderColor: 'white'
  },
  header: {
    backgroundColor: '#DCDCDC'
  }
});