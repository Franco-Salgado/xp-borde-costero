import { View, StyleSheet,Image} from 'react-native';
import TomarMuestra from "../components/button";
import image from '../assets/BordeCostero.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Alert,
    SafeAreaView,
    ScrollView,
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
import React, {
    useState,
    useEffect,
  } from 'react';
import {
    Colors,
  } from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager/BleManager';  
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Home = ({navigation}) => {
  //Variables del manejo del dispositivo
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [flagS, setFlagS] = useState(true);
    const [list, setList] = useState([]);
    const peripherals = new Map();
  //Escanea los dispositivos
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
  //Maneja el detener los dispositivos
    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsScanning(false);
    }
  //Maneja la desconexion
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
  //Recibe el dispositivo conectado
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
  //Maneja los dispositivos descubiertos y les asigna un nombre si es que no tienen
  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    setList(Array.from(peripherals.values()));
  }
  //Conexion con el dispositivo
 const  testPeripheral = (peripheral) => {
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
    }}
    //Lista de dispositivos
    const renderItem = (item) => {
        
        return (
          <TouchableHighlight onPress={() => navigation.navigate('Dispositivos', {dispositivo: item})}>
            <View style = {{alignSelf:'center'}}>
              <Text style = {{color: Colors.white}}>{item.name}</Text>
              <Text style = {{color: Colors.white}}>RSSI: {item.rssi}</Text>
              <Text style = {{color: Colors.white}}>{item.id}</Text>
            </View>
          </TouchableHighlight>
        );
      }

    //Inicializacion del ble
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

      return(
        <View style={styles.container}>
            <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
            <Image source ={require('../assets/BordeCostero.png')} style = {styles.image}/>
            <View style={{margin: 10}}>
                <Button 
                title={'Escanear Dispositivos (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => startScan() } 
                />            
            </View>
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
                renderItem={({ item }) => renderItem( item) }
                keyExtractor={item => item.id}
              />
            }
        </View>
    

    )
}
const styles = StyleSheet.create({
    container: { 
        justifyContent:"center",
        flex: 1, 
        backgroundColor: "#404040",
        flexDirection:"column"},
    image: {
        height: 170, 
        width:360,
        margin: 10,
        marginTop: StatusBar.currentHeight,
    },
  });

export default Home;