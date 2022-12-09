import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text,StyleSheet,Constants,Image, Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight, Dimensions} from 'react-native';
import { DataTable } from 'react-native-paper';
import { LineChart } from "react-native-chart-kit";

import image from '../assets/BordeCostero.png'
import TomarMuestra from "../components/button";
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BleManager from 'react-native-ble-manager/BleManager';
import { Buffer } from 'buffer';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Dispositivos = ({route, navigation}) => {
  //Variables 
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const key_sensor1 = '@Sensor1';
    const [flag, setFlag] = useState(0);
    const [value, setValue] = useState();
    const [id, setId] = useState(0);
    //Dispositivo recolectado en la pantalla anterior
    const {dispositivo} = route.params;
    //Variables de datos recolectados
    const [temp, setTemp] = useState();
    const [hum, setHum] = useState();
    const [pre, setPre] = useState();
    const [temp2, setTemp2] = useState();
    const [uv, setUv] = useState();
    const [sensor, setSensor] = useState("");
    //Variables de manejo de datos
    const [graf, setGraf] = useState('temp');
    const [tabla, setTabla] = useState('primeras tres');
    const peripherals = new Map();
    const [list, setList] = useState([]);
    const [clickeable, setClickeable] = useState(false);
    var sensor1 = [];

    //Guardar cosas en la memoria
    const setItem = async (key, dato) => {
        try {
          console.log('SET: ', dato);
          await AsyncStorage.setItem(key, dato);
        } catch(e) {
          alert('Error al almacenar');
        }
      }
    
    //Obtiene información de la memoria
    const getItem = async (key) => {
        try {
          setValue(await AsyncStorage.getItem(key));
          console.log('GET: ', await AsyncStorage.getItem(key));
        } catch(e) {
          alert('Error al recuperar');
        }
      }
    //Limpia la memoria
    const clearAll = async () => {
        try {
          await AsyncStorage.clear()
        } catch(e) {
          alert('Error en el clear')
        }
      }
    //Funciones del Bluetooth
    //Manejo del dispositivo
    const startScan = () => {
          if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
              console.log('Scanning...');
              setIsScanning(true);
              console.log(results);
            }).catch(err => {
              console.error(err);
            });
          }    
        }
      
        const handleStopScan = () => {
          console.log('Scan is stopped');
          setIsScanning(false);
        }
      
        const handleDisconnectedPeripheral = (data) => {
          let peripheral = peripherals.get(data.peripheral);
          if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
          }
          console.log('Disconnected from ' + data.peripheral);
        }
      
        const handleUpdateValueForCharacteristic = (data) => {
          console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
        }
      
        const retrieveConnected = () => {
          BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
              console.log('No connected peripherals')
            }
            console.log(results);
            for (var i = 0; i < results.length; i++) {
              var peripheral = results[i];
              peripheral.connected = true;
              peripherals.set(peripheral.id, peripheral);
              setList(Array.from(peripherals.values()));
            }
          });
        }
      
        const handleDiscoverPeripheral = (peripheral) => {
          console.log('Got ble peripheral', peripheral);
          if (!peripheral.name) {
            peripheral.name = 'NO NAME';
          }
          peripherals.set(peripheral.id, peripheral);
          setList(Array.from(peripherals.values()));
        }
    //Conexion y prueba del dispositivo
    const testPeripheral = (peripheral) => {
        if (peripheral){
          if (peripheral.connected){
            BleManager.disconnect(peripheral.id);
            setIsConnected(false);
          }else{
            BleManager.connect(peripheral.id).then(() => {
              let p = peripherals.get(peripheral.id);
              if (p) {
                p.connected = true;
                peripherals.set(peripheral.id, p);
                setList(Array.from(peripherals.values()));
              }
              console.log('Connected to ' + peripheral.id);
              setIsConnected(true);
              setSensor(peripheral.id);
              console.log(sensor);
            }).catch((error) => {
              console.log('Connection error', error);
            });
          }
        }
    
      }
      //Almacenar los datos recividos
      const storeSensor1 = () => {
        setFlag(flag+1);
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
      //Obtener la fecha actual
      const getCurrentDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hour = new Date().getHours();
        var minute = new Date().getMinutes();
        var seconds = new Date().getSeconds();
        var mseconds = new Date().getMilliseconds();
        return date + '-' + month + '-' + year + " " + hour + ":" + minute + ":" + seconds;
      }
    
    //Recibir los datos del sensor
    const readSensor = (peripheralId) => {
        BleManager.retrieveServices(peripheralId).then((peripheralData) =>{
          for (key in peripheralData["characteristics"]){
            console.log("entre" + key);
            switch(key){
              case '5':
                console.log(peripheralData["characteristics"][key]["service"]);
                console.log(peripheralData["characteristics"][key]["characteristic"]);
                BleManager.read(
                  peripheralId,
                  peripheralData["characteristics"][key]["service"],
                  peripheralData["characteristics"][key]["characteristic"]
                )
                  .then((readData) => {
                    // Success code
                    console.log("Read: " + readData);
                
                    const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    let text = "";
                    for(let member in buffer) {
                      if (buffer[member] == 46){
                        text += '.';
                      } else if (47 < buffer[member] < 58){
                        text += String.fromCharCode(buffer[member]);
                      }
                    }
                    setTemp(parseFloat(text));
                    console.log(text);
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });
                break;
              case '6':
                console.log(peripheralData["characteristics"][key]["service"]);
                console.log(peripheralData["characteristics"][key]["characteristic"]);
                BleManager.read(
                  peripheralId,
                  peripheralData["characteristics"][key]["service"],
                  peripheralData["characteristics"][key]["characteristic"]
                )
                  .then((readData) => {
                    // Success code
                    console.log("Read: " + readData);
                
                    const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    let text = "";
                    for(let member in buffer) {
                      if (buffer[member] == 46){
                        text += '.';
                      } else if (47 < buffer[member] < 58){
                        text += String.fromCharCode(buffer[member]);
                      }
                    }
                    setHum(parseFloat(text));
                    console.log(text);
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });
                break;
              case '7':
                console.log(peripheralData["characteristics"][key]["service"]);
                console.log(peripheralData["characteristics"][key]["characteristic"]);
                BleManager.read(
                  peripheralId,
                  peripheralData["characteristics"][key]["service"],
                  peripheralData["characteristics"][key]["characteristic"]
                )
                  .then((readData) => {
                    // Success code
                    console.log("Read: " + readData);
                
                    const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    let text = "";
                    for(let member in buffer) {
                      if (buffer[member] == 46){
                        text += '.';
                      } else if (47 < buffer[member] < 58){
                        text += String.fromCharCode(buffer[member]);
                      }
                    }
                    console.log(text);
                    setPre(parseFloat(text));
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });
                break;
              case '8':
                console.log(peripheralData["characteristics"][key]["service"]);
                console.log(peripheralData["characteristics"][key]["characteristic"]);
                BleManager.read(
                  peripheralId,
                  peripheralData["characteristics"][key]["service"],
                  peripheralData["characteristics"][key]["characteristic"]
                )
                  .then((readData) => {
                    // Success code
                    console.log("Read: " + readData);
                
                    const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    let text = "";
                    for(let member in buffer) {
                      if (buffer[member] == 46){
                        text += '.';
                      } else if (47 < buffer[member] < 58){
                        text += String.fromCharCode(buffer[member]);
                      }
                    }
                    setTemp2(parseFloat(text));
                    console.log(text);
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });
                break;
              case '9':
                console.log(peripheralData["characteristics"][key]["service"]);
                console.log(peripheralData["characteristics"][key]["characteristic"]);
                BleManager.read(
                  peripheralId,
                  peripheralData["characteristics"][key]["service"],
                  peripheralData["characteristics"][key]["characteristic"]
                )
                  .then((readData) => {
                    // Success code
                    console.log("Read: " + readData);
                
                    const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                    let text = "";
                    for(let member in buffer) {
                      if (buffer[member] == 46){
                        text += '.';
                      } else if (47 < buffer[member] < 58){
                        text += String.fromCharCode(buffer[member]);
                      }
                    }
                    setUv(parseFloat(text));
                    console.log(text);
                  })
                  .catch((error) => {
                    // Failure code
                    console.log(error);
                  });
                break;
            }
          }
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
      //Renderiza la tabla
      const renderTabla = (vInd) => {
        switch (vInd) {
          case 'primeras tres':
            return (
              <DataTable style={styles.table}>
                <DataTable.Header style={styles.header}>
                  <DataTable.Title style={styles.columnId}>#</DataTable.Title>
                  <DataTable.Title style={styles.columnFecha}>Fecha</DataTable.Title>
                  <DataTable.Title style={styles.columnFlecha} onPress={() => setTabla('ultimas dos')}>←→</DataTable.Title>
                  <DataTable.Title style={styles.columnDato} onPress={() => setGraf('temp')}>T[°C]</DataTable.Title>
                  <DataTable.Title style={styles.columnDato} onPress={() => setGraf('hum')}>H%</DataTable.Title>
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
                            <DataTable.Cell style={styles.columnFlecha}></DataTable.Cell>
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
            )
          break;
          case 'ultimas dos':
            return (
              <DataTable style={styles.table}>
                <DataTable.Header style={styles.header}>
                  <DataTable.Title style={styles.columnId}>#</DataTable.Title>
                  <DataTable.Title style={styles.columnFecha}>Fecha</DataTable.Title>
                  <DataTable.Title style={styles.columnFlecha} onPress={() => setTabla('primeras tres')}>←→</DataTable.Title>
                  <DataTable.Title style={styles.columnDato} onPress={() => setGraf('temp2')}>T[°C]</DataTable.Title>
                  <DataTable.Title style={styles.columnDato} onPress={() => setGraf('uv')}>UV[mW/cm^2]</DataTable.Title>
                  <DataTable.Cell style={styles.columnDato}></DataTable.Cell>
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
                            <DataTable.Cell style={styles.columnDato}></DataTable.Cell>
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
      //Renderiza la grafica
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
      //Conecta con la memoria al entrar
      useEffect(() => {
        getItem(key_sensor1);
        // clearAll();
      }, [])
      //Conecta con el dispositivo al entrar a la screen
      useEffect(() => {
        testPeripheral(dispositivo);
      },[])
      //Inicializa las variables ble
      useEffect(() => {
        BleManager.start({showAlert: false});
    
        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
    
        if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("Permission is OK");
              } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                  if (result) {
                    console.log("User accept");
                  } else {
                    console.log("User refuse");
                  }
                });
              }
          });
        }  
        
        return (() => {
          console.log('unmount');
          bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
          bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan );
          bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
          bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
        })
      }, []);

      //Maneja la lectura de datos
      const datosSet = () => {
        if (value) {setId(JSON.parse(value)[0].id+1);}
        readSensor(sensor);
        setClickeable(true);
          }
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'black'} />
      <View style={styles.data}>
        <TomarMuestra onPress={() => datosSet()} />
        {(temp && hum && pre && temp2 && uv) &&
          <Text style = {{color: Colors.white}}>Temperatura:{temp}[°C]   Humedad:{hum}%   Presión:{pre}[Pa]   Sensor sumergible:{temp2}[°C]   UV:{uv}[mW/cm^2]</Text>}
        <Button title={"Almacenar"} disabled={!clickeable} onPress={() => {storeSensor1();
        setClickeable(false)}}/>
      </View>
      <Text style = {{color: Colors.white}} >Presione sobre una de las letras para ver su gráfica</Text>
      {renderTabla(tabla)}
      {(value) &&
        renderGrafica(graf)
      }
    </SafeAreaView>
    )

    
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#404040"
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
    flex: 33,
    backgroundColor: Colors.white,
    justifyContent: 'center'
  },
  columnDato: {
    backgroundColor: Colors.white,
    flex: 8,
    justifyContent: 'center'
  },
  columnFlecha: {
    backgroundColor: Colors.white,
    flex: 6,
    justifyContent: 'center'
  },
  columnId: {
    backgroundColor: Colors.white,
    flex: 4,
    justifyContent: 'center'
  },
  header: {
    backgroundColor: '#DCDCDC'
  },
  grafica: {
    justifyContent: 'flex-end'
  },
  image: {height: 170, width:370,  alignSelf: "center",}
});
export default Dispositivos