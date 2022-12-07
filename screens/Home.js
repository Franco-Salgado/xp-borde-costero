
import { View, StyleSheet,Image} from 'react-native';
import TomarMuestra from "../components/button";
import image from '../assets/BordeCostero.png'
import Constants from 'expo-constants';
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

const Home = ({navigation}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [flagS, setFlagS] = useState(true);
    const [list, setList] = useState([{"id": "id", "rssi": "rssi", "name": "name"}, {"id": "id", "rssi": "rssi", "name": "name"}, {"id": "id", "rssi": "rssi", "name": "name"}]);
    
    
    const renderItem = (item) => {
        
        return (
          <TouchableHighlight onPress={() => navigation.navigate('Dispositivos')}>
            <View style = {{alignSelf:'center'}}>
              <Text >{item.name}</Text>
              <Text >RSSI: {item.rssi}</Text>
              <Text >{item.id}</Text>
            </View>
          </TouchableHighlight>
        );
      }


      return(
        <View style={styles.container}>
            <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {/* {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
            )} */}
            <View style={styles.body}>
            <Image source ={require('../assets/BordeCostero.png')} style = {styles.image}/>
            <View style={{margin: 10}}>
                <Button 
                title={'Escanear Dispositivos (' + (isScanning ? 'on' : 'off') + ')'}
                onPress={() => setFlagS(true) } 
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
        {(flagS) &&
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
        marginTop: Constants.statusBarHeight,
    },
  })

export default Home