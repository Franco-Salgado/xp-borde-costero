import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, SafeAreaView, StatusBar, Dimensions, Modal } from 'react-native';
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
  const [tabla, setTabla] = useState('ultimas dos');
  const [modalVisible, setModalVisible] = useState(false);

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
    temperatura2 = Math.floor(Math.random() * 273)
    setTemp2(temperatura2);
    ultra_violeta = Math.floor(Math.random() * 100)
    setUv(ultra_violeta);
    if (value) {setId(JSON.parse(value)[0].id+1);}
  }

  const storeSensor1 = () => {
    const fecha = getCurrentDate();
    if (value) {
      sensor1 = JSON.parse(value);
    } else {
      sensor1 = [];
    }
    sensor1.unshift({'id':id, 'f':fecha, 't':temp, 'h':hum, 'p':pre, 't2':temp2, 'uv':uv});
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

  const renderModal = () => {
    setModalVisible(!modalVisible)
  }

  // Tabla
  const renderTabla = (vInd) => {
    switch (vInd) {
      case 'primeras tres':
        return (
          <DataTable style={styles.table}>
            <DataTable.Header style={styles.header}>
              <DataTable.Title style={styles.columnId}>#</DataTable.Title>
              <DataTable.Title style={styles.columnFecha}>Fecha</DataTable.Title>
              <DataTable.Title style={styles.columnDato} onPress={() => setGraf('temp')}>T[°C]</DataTable.Title>
              <DataTable.Title style={styles.columnDato} onPress={() => setGraf('hum')}>H%</DataTable.Title>
              <DataTable.Title style={styles.columnDato} onPress={() => setGraf('pre')}>P[Pa]</DataTable.Title>
              <DataTable.Title style={styles.columnFlecha} onPress={() => setTabla('ultimas dos')}>→</DataTable.Title>
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
                        <DataTable.Cell style={styles.columnFlecha}></DataTable.Cell>
                      </DataTable.Row>
                    )
                  })
                }
              </ScrollView>
            }
          </DataTable>
        )
      break;
      case 'ultimas dos':
        return (
          <DataTable style={styles.table}>
            <DataTable.Header style={styles.header}>
              <DataTable.Title style={styles.columnId}>#</DataTable.Title>
              <DataTable.Title style={styles.columnFecha}>Fecha</DataTable.Title>
              <DataTable.Title style={styles.columnFlecha} onPress={() => setTabla('primeras tres')}>←</DataTable.Title>
              <DataTable.Title style={styles.columnDato} onPress={() => setGraf('temp2')}>T[°C]</DataTable.Title>
              <DataTable.Title style={styles.columnDato} onPress={() => setGraf('uv')}>UV%</DataTable.Title>
            </DataTable.Header>
            {(value) &&
              <ScrollView style={styles.scroll}>
                {
                  JSON.parse(value).map(valor => {
                    return (
                      <DataTable.Row key={valor.id}>
                        <DataTable.Cell style={styles.columnId} numeric>{valor.id}</DataTable.Cell>
                        <DataTable.Cell style={styles.columnFecha} numeric>{valor.f}</DataTable.Cell>
                        <DataTable.Cell style={styles.columnFlecha}></DataTable.Cell>
                        <DataTable.Cell style={styles.columnDato} numeric>{valor.t2}</DataTable.Cell>
                        <DataTable.Cell style={styles.columnDato} numeric>{valor.uv}</DataTable.Cell>
                      </DataTable.Row>
                    )
                  })
                }
              </ScrollView>
            }
          </DataTable>
        )
      break;
    }
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
        case 'uv':
          return (
            <LineChart
              data={{
                labels: JSON.parse(value).slice(0, 10).map(valor => {
                  return(valor.id)
                }),
                datasets: [
                  {
                    data: JSON.parse(value).slice(0, 10).map(valor => {
                      return(valor.uv)
                    }),
                    strokeWidth: 2
                  },
                ],
              }}
              width={Dimensions.get('window').width}
              height={220}
              chartConfig={{
                backgroundColor: 'violet',
                backgroundGradientFrom: 'black',
                backgroundGradientTo: 'violet',
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
        case 'temp2':
          return (
            <LineChart
              data={{
                labels: JSON.parse(value).slice(0, 10).map(valor => {
                  return(valor.id)
                }),
                datasets: [
                  {
                    data: JSON.parse(value).slice(0, 10).map(valor => {
                      return(valor.t2)
                    }),
                    strokeWidth: 2
                  },
                ],
              }}
              width={Dimensions.get('window').width}
              height={220}
              chartConfig={{
                backgroundColor: 'orange',
                backgroundGradientFrom: 'black',
                backgroundGradientTo: 'orange',
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
      <Button title="Escanear dispositivos" onPress={() => renderModal()}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Dispositivo 1</Text>
            <Text>Dispositivo 2</Text>
            <Text>Dispositivo 3</Text>
            <Text>Dispositivo 4</Text>
            <Text>Dispositivo 5</Text>
            <Button title="Cerrar" onPress={() => renderModal()}/>
          </View>
        </View>
      </Modal>
      <View style={styles.data}>
        <Button title="Tomar muestra" onPress={() => readSensor1()} />
        {(temp && hum && pre && temp2 && uv) &&
          <Text>{temp}[°C]   {hum}%   {pre}[Pa]   {temp2}[°C]   {uv}%</Text>}
        <Button title="Almacenar muestra" onPress={() => storeSensor1()} />
      </View>
      <Text>Presione sobre una de las letras para ver su gráfica</Text>
      {renderTabla(tabla)}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
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
  columnFlecha: {
    flex: 5,
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