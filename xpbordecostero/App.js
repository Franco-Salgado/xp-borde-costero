/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

 import React, {
  useState,
  useEffect,
} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Button,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager/BleManager';

import { Buffer } from 'buffer';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [temp, setTemp] = useState("null");
  const [hum, setHum] = useState("null");
  const [pre, setPre] = useState("null");
  const [temp2, setTemp2] = useState("null");
  const [uv, setUv] = useState("null");
  const [sensor, setSensor] = useState("");
  const peripherals = new Map();
  const [list, setList] = useState([]);
  var sensor1 = {};
  var sensor2 = {};

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
                sensor1['t'] = text;
                setTemp(text);
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
                sensor1['h'] = text;
                setHum(text);
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
                sensor1['p'] = text;
                console.log(text);
                setPre(text);
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
                sensor2['t'] = text;
                setTemp2(text);
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
                sensor1['uv'] = text;
                setUv(text);
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

  const readSensor2 = (peripheralId) => {
    BleManager.retrieveServices(peripheralId).then((peripheralData) =>{
      for (key in peripheralData["characteristics"]){
        console.log("entre" + key);
        switch(key){
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
                sensor2['t'] = text;
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


  const conectar = (peripheral) => {
    testPeripheral(peripheral);
  }
  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => conectar(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  const datosSet = () => {
    readSensor(sensor);
  }
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style = {styles.background}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {/* {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )} */}
          <View style={styles.body}>
            
            <View style={{margin: 10}}>
              <Button 
                title={'Escanear Dispositivos (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan() } 
              />            
            </View>
            {(!isConnected) &&
            <View style={{margin: 10}}>
              <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected() } />
            </View>
            }
            {(list.length > 0 && !isConnected) &&
              <View>
                <Text style={{textAlign: 'center', color: Colors.white}}>Presione un dispostivo para conectar</Text>
              </View>
            }
            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center', color: Colors.white}}>Ningun dispostivo encontrado</Text>
              </View>
            }
          </View>              
        </ScrollView>
        {(!isConnected) &&
        <FlatList
            data={list}
            renderItem={({ item }) => renderItem(item) }
            keyExtractor={item => item.id}
          />
        }
        {(isConnected) &&
          <View style={{margin: 10}}>
            <View style={{margin: 10, flexDirection: "row"}}>
              <View style={{flex:0.5}} />
              <Button title='Tomar muestra' onPress={() => datosSet()}/>
              <View style={{flex:0.5}} />
            </View>
            <View style={{flex:0.1}} />
            <Text style={{textAlign: 'center', color: Colors.white}}>Sensor Humedad, Temperatura, Presión</Text>
            <View style={{margin: 10, flexDirection: "row"}}>
              <View style={{flex:0.1}} />
              <View style={{flex:1}}>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Temperatura</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>{temp}</Text>
              </View>
              <View style={{flex:0.1}} />
              <View style={{flex:1}}>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Humedad</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>{hum}</Text>
              </View>
              <View style={{flex:0.1}} />
              <View style={{flex:1}}>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Presión</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>{pre}</Text>
              </View>
              <View style={{flex:0.1}} />
            </View>
            <View style={{flex:0.1}} />
            <View style={{margin: 10, flexDirection: "row"}}>
              <View style={{flex:0.1}} />
              <View style={{flex:1}}>
              <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Sensor sumergible</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Temperatura</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>{temp2}</Text>
              </View>
              <View style={{flex:0.1}} />
              <View style={{flex:1}}>
              <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Sensor UV</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>UV</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>{uv}</Text>
              </View>
              <View style={{flex:0.1}} />
            </View>
          </View>
        }       

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#404040",
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#404040",
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: "#404040",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
/*{"advertising": 
  {"isConnectable": true, "localName": "Long name works now", 
  "manufacturerData": 
    {"CDVType": "ArrayBuffer", "bytes": [Array], "data": "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAFAlMb25nIG5hbWUgd29ya3Mgbm93AgoDBRISAEAAAAAAAAA="}, 
  "serviceData": {}, "serviceUUIDs": ["4fafc201-1fb5-459e-8fcc-c5c9c331914b"], "txPowerLevel": 3}, 
  "characteristics": [{"characteristic": "2a05", "descriptors": [Array], "properties": [Object], "service": "1801"}, {"characteristic": "2a00", "properties": [Object], "service": "1800"}, {"characteristic": "2a01", "properties": [Object], "service": "1800"}, {"characteristic": "2aa6", "properties": [Object], "service": "1800"}, {"characteristic": "beb5483e-36e1-4688-b7f5-ea07361b26a8", "properties": [Object], "service": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}, {"characteristic": "6046f3b2-769f-400c-8d67-8a856e09121a", "properties": [Object], "service": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}, {"characteristic": "b9d456ea-5ab6-4350-adc0-10e2272b87df", "properties": [Object], "service": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}, {"characteristic": "5d5e967f-b7ee-4fdf-926c-219ee25e8bcc", "properties": [Object], "service": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}, {"characteristic": "7e133607-da9c-4444-b622-f8421eb2ba71", "properties": [Object], "service": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}],
   "id": "A4:E5:7C:FC:D9:A6", "name": "Long name works now", "rssi": -69, "services": [{"uuid": "1801"}, {"uuid": "1800"}, {"uuid": "4fafc201-1fb5-459e-8fcc-c5c9c331914b"}]} */