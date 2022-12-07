import react from "react";
import {View, Text,StyleSheet,Constants,Image} from 'react-native'
import image from '../assets/BordeCostero.png'
import TomarMuestra from "../components/button";
import {Colors} from 'react-native/Libraries/NewAppScreen';
import React, {
    useState,
  } from 'react';


const Dispositivos = ({navigation}) => {

    const [temp, setTemp] = useState("null");
    const [hum, setHum] = useState("null");
    const [pre, setPre] = useState("null");
    const [temp2, setTemp2] = useState("null");
    const [uv, setUv] = useState("null");
    
    
    
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


    return (
    <View style = {styles.container}>
        <View style={{margin: 10}}>
        <View style={{margin: 10, flexDirection: "row"}}>
          <View style={{flex:0.5}} />
          <TomarMuestra onPress={() => readSensor1()}/>
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