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
  const [isS1, setIsS1] = useState(false);
  const [isS2, setIsS2] = useState(false);
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
          sensor = peripheral.id;
          console.log(sensor);
          setTimeout(() => {

            /* Test read current RSSI value */
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);

              BleManager.readRSSI(peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
                let p = peripherals.get(peripheral.id);
                if (p) {
                  p.rssi = rssi;
                  peripherals.set(peripheral.id, p);
                  setList(Array.from(peripherals.values()));
                }                
              });
              
            });

            // Test using bleno's pizza example
            // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
            /*
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = '13333333-3333-3333-3333-333333333337';
              var bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
              var crustCharacteristic = '13333333-3333-3333-3333-333333330001';
              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                      console.log('Writed NORMAL crust');
                      BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                        console.log('Writed 351 temperature, the pizza should be BAKED');
                        
                        //var PizzaBakeResult = {
                        //  HALF_BAKED: 0,
                        //  BAKED:      1,
                        //  CRISPY:     2,
                        //  BURNT:      3,
                        //  ON_FIRE:    4
                        //};
                      });
                    });
                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 200);
            });*/

            

          }, 900);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }

  }

  const readSensor1 = (peripheralId) => {
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
              })
              .catch((error) => {
                // Failure code
                console.log(error);
              });
            break;
        }
      }
      isS1(true);
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
      isS2(true);
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

  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => testPeripheral(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            
            <View style={{margin: 10}}>
              <Button 
                title={'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan() } 
              />            
            </View>

            <View style={{margin: 10}}>
              <Button title="Retrieve connected peripherals" onPress={() => retrieveConnected() } />
            </View>

            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            }
          
          </View>              
        </ScrollView>
        <FlatList
            data={list}
            renderItem={({ item }) => renderItem(item) }
            keyExtractor={item => item.id}
          />
        {(isConnected) &&
          <View style={{margin: 10}}>
            <Button title="Sensor 1" onPress={() => readSensor1(sensor)} />
            <Button title="Sensor 2" onPress={() => readSensor2(sensor)} />
          </View>
        }        
        {(isS1) &&
          <View style={{margin: 10}}>
            <Text style={{textAlign: 'center'}}>{sensor1['t'] + " " + sensor1['h'] + " " + sensor1['p']}</Text>
            <Text style={{textAlign: 'center'}}>Sensor 1</Text>
          </View>}      
        {(isS2) &&
          <View style={{margin: 10}}>
            <Text style={{textAlign: 'center'}}>{sensor2['t']}</Text>
          </View>}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
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