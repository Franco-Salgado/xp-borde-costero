import react, { useEffect } from "react";
import {View, Text,StyleSheet,Constants,Image} from 'react-native'
import image from '../assets/BordeCostero.png'
import TomarMuestra from "../components/button";
import {Colors} from 'react-native/Libraries/NewAppScreen';
import React, {
    useState,
  } from 'react';
  import BleManager from 'react-native-ble-manager/BleManager';
  import { Buffer } from 'buffer';
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Dispositivos = ({navigation}) => {
    const {dispositivo} = route.params;
    const [temp, setTemp] = useState("null");
    const [hum, setHum] = useState("null");
    const [pre, setPre] = useState("null");
    const [temp2, setTemp2] = useState("null");
    const [uv, setUv] = useState("null");
    const [sensor, setSensor] = useState("");

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
                    sensor1['t2'] = text;
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
    
      useEffect(() => {
        testPeripheral(dispositivo);
      },[])
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

    return (
    <View style = {styles.container}>
        <View style={{margin: 10}}>
        <View style={{margin: 10, flexDirection: "row"}}>
          <View style={{flex:0.5}} />
          <TomarMuestra onPress={() => readSensor(sensor)}/>
          <View style={{flex:0.5}} />
        </View>
        <View style={{flex:0.1}} />
        <Text style={{textAlign: 'center', color: Colors.white}}>Sensor Humedad, Temperatura, Presión</Text>
        <View style={{margin: 10, flexDirection: "row"}}>
          <View style={{flex:0.1}} />
          <View style={{flex:1}}>
            <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Temperatura</Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: Colors.white, padding: 10}}>{temp}</Text>
          </View>
          <View style={{flex:0.1}} />
          <View style={{flex:1}}>
            <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Humedad</Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: Colors.white, padding: 10}}>{hum}</Text>
          </View>
          <View style={{flex:0.1}} />
          <View style={{flex:1}}>
            <Text style={{fontSize: 12, textAlign: 'center', color: Colors.white, padding: 10}}>Presión</Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: Colors.white, padding: 10}}>{pre}</Text>
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
    </View>
    )

    
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#404040",},
    image: {height: 170, width:370,  alignSelf: "center",},
  })
export default Dispositivos