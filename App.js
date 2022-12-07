import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";

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
    const fecha = getCurrentDate();
    sensor1 = JSON.parse(value);
    sensor1.push({'f':fecha, 't':temp, 'h':hum, 'p':pre});
    setValue(JSON.stringify(sensor1));
    setItem(key_sensor1, value);
  }

  // Otros
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    var seconds = new Date().getSeconds();
    var mseconds = new Date().getMilliseconds();
    return date + '-' + month + '-' + year + " " + hour + ":" + minute + ":" + seconds + ":" + mseconds;
  }

  const line = () => {
    JSON.parse(value).map(valor => {
      const linedata = {
        labels: [valor.f],
        datasets: [{
          data: [],
          strokeWidth: 2
        }]
      }
    })
  }

  const linedata = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2, // optional
      },
    ],
  };

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
                <DataTable.Title style={styles.columnFecha}>Fecha</DataTable.Title>
                <DataTable.Title style={styles.columnDato}>T[°C]</DataTable.Title>
                <DataTable.Title style={styles.columnDato}>H[%]</DataTable.Title>
                <DataTable.Title style={styles.columnDato}>P[Pa]</DataTable.Title>
              </DataTable.Header>
              {
                JSON.parse(value).map(valor => {
                  return (
                    <DataTable.Row key={valor.f}>
                      <DataTable.Cell style={styles.columnFecha} numeric>{valor.f}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDato} numeric>{valor.t}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDato} numeric>{valor.h}</DataTable.Cell>
                      <DataTable.Cell style={styles.columnDato} numeric>{valor.p}</DataTable.Cell>
                    </DataTable.Row>
                  )
                })
              }
            </DataTable>
          }
        </ScrollView>
        <LineChart
            data={linedata}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel={'$'}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {}
            }}
            bezier
            style={{}}
          />
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
    paddingHorizontal: 5
  },
  table: {
    borderStartColor: 'solid',
    borderColor: 'white'
  },
  columnFecha: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  columnDato: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: '#DCDCDC'
  }
});