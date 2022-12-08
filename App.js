import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

const App = () => {
  // Variables y constantes
  const key_sensor1 = '@Sensor1';
  const [value, setValue] = useState();
  const [id, setId] = useState(0);

  const [temp, setTemp] = useState();
  const [hum, setHum] = useState();
  const [pre, setPre] = useState();
  const [temp2, setTemp2] = useState();
  const [uv, setUv] = useState();

  const [graf, setGraf] = useState('temp');

  var sensor1 = [];

  // Funciones de memoria
  const setItem = async (key, dato) => {
    try {
      console.log('SET: ', dato);
      await AsyncStorage.setItem(key, dato);
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

  clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      alert('Error en el clear')
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
    if (value) {setId(JSON.parse(value)[0].id+1);}
  }

  const storeSensor1 = () => {
    const fecha = getCurrentDate();
    if (value) {
      sensor1 = JSON.parse(value);
    } else {
      sensor1 = [];
    }
    sensor1.unshift({'id':id, 'f':fecha, 't':temp, 'h':hum, 'p':pre});
    setValue(JSON.stringify(sensor1));
    setItem(key_sensor1, JSON.stringify(sensor1));
  }

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

  // Gráfica
  const renderGrafica = (vDep) => {
    switch (vDep) {
      case 'temp':
        return (
          <LineChart
            data={{
              labels: JSON.parse(value).slice(0, 10).map(valor => {
                return(valor.id)
              }),
              datasets: [
                {
                  data: JSON.parse(value).slice(0, 10).map(valor => {
                    return(valor.t)
                  }),
                  strokeWidth: 2
                },
              ],
            }}
            width={Dimensions.get('window').width}
            height={220}
            chartConfig={{
              backgroundColor: 'red',
              backgroundGradientFrom: 'black',
              backgroundGradientTo: 'red',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {},
              title: 'Temperatura'
            }}
            bezier
            style={styles.grafica}
          />
        )
        break;
      case 'hum':
        return (
          <LineChart
            data={{
              labels: JSON.parse(value).slice(0, 10).map(valor => {
                return(valor.id)
              }),
              datasets: [
                {
                  data: JSON.parse(value).slice(0, 10).map(valor => {
                    return(valor.h)
                  }),
                  strokeWidth: 2
                },
              ],
            }}
            width={Dimensions.get('window').width}
            height={220}
            chartConfig={{
              backgroundColor: 'blue',
              backgroundGradientFrom: 'black',
              backgroundGradientTo: 'blue',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {},
              title: 'Humedad'
            }}
            bezier
            style={styles.grafica}
          />
        )
        break;
      case 'pre':
        return (
          <LineChart
            data={{
              labels: JSON.parse(value).slice(0, 10).map(valor => {
                return(valor.id)
              }),
              datasets: [
                {
                  data: JSON.parse(value).slice(0, 10).map(valor => {
                    return(valor.p)
                  }),
                  strokeWidth: 2
                },
              ],
            }}
            width={Dimensions.get('window').width}
            height={220}
            chartConfig={{
              backgroundColor: 'green',
              backgroundGradientFrom: 'black',
              backgroundGradientTo: 'green',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {},
              title: 'Presión'
            }}
            bezier
            style={styles.grafica}
          />
        )
        break;
    }
  }

  useEffect(() => {
    getItem(key_sensor1);
    // clearAll();
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
      <Text>Presione sobre una de las letras para ver su gráfica</Text>
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.header}>
          <DataTable.Title style={styles.columnId}>#</DataTable.Title>
          <DataTable.Title style={styles.columnFecha}>Fecha</DataTable.Title>
          <DataTable.Title style={styles.columnDato} onPress={() => setGraf('temp')}>T[°C]</DataTable.Title>
          <DataTable.Title style={styles.columnDato} onPress={() => setGraf('hum')}>H[%]</DataTable.Title>
          <DataTable.Title style={styles.columnDato} onPress={() => setGraf('pre')}>P[Pa]</DataTable.Title>
        </DataTable.Header>
        {(value) &&
          <ScrollView style={styles.scroll}>
            {
              JSON.parse(value).map(valor => {
                return (
                  <DataTable.Row key={valor.id}>
                    <DataTable.Cell style={styles.columnId} numeric>{valor.id}</DataTable.Cell>
                    <DataTable.Cell style={styles.columnFecha} numeric>{valor.f}</DataTable.Cell>
                    <DataTable.Cell style={styles.columnDato} numeric>{valor.t}</DataTable.Cell>
                    <DataTable.Cell style={styles.columnDato} numeric>{valor.h}</DataTable.Cell>
                    <DataTable.Cell style={styles.columnDato} numeric>{valor.p}</DataTable.Cell>
                  </DataTable.Row>
                )
              })
            }
          </ScrollView>
        }
      </DataTable>
      {(value) &&
        renderGrafica(graf)
      }
    </SafeAreaView>
  );
};

export default () => (
  <App />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  data: {
    paddingVertical: 25
  },
  table: {
    flex: 1,
    borderStartColor: 'solid',
    borderColor: 'white'
  },
  scroll: {
  },
  columnFecha: {
    flex: 50,
    justifyContent: 'center'
  },
  columnDato: {
    flex: 12,
    justifyContent: 'center'
  },
  columnId: {
    flex: 5,
    justifyContent: 'center'
  },
  header: {
    backgroundColor: '#DCDCDC'
  },
  grafica: {
    justifyContent: 'flex-end'
  },
});