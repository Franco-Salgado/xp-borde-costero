/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */
 import MainStack from "./navigation/MainStack";
import {
  StyleSheet,
  View,
} from 'react-native';


const App = () => {
  return (
  <View style={styles.background}>
    <MainStack />
  </View>
  )


/*  
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [flagS, setFlagS] = useState(true);
  const [temp, setTemp] = useState("null");
  const [hum, setHum] = useState("null");
  const [pre, setPre] = useState("null");
  const [temp2, setTemp2] = useState("null");
  const [uv, setUv] = useState("null");
  const [list, setList] = useState([{"id": "id", "rssi": "rssi", "name": "name"}, {"id": "id", "rssi": "rssi", "name": "name"}, {"id": "id", "rssi": "rssi", "name": "name"}]);

  const aux = () =>{
    setFlagS(false);
    setIsConnected(true);
  }
  const renderItem = (item) => {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => aux()}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }
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
          )} }
          <View style={styles.body}>
            
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
        <SafeAreaView style={{flex: 1}}>
          <MainStack />       
        </SafeAreaView>


        {(flagS) &&
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
              <Button title='Tomar muestra' onPress={() => readSensor1()}/>
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
  
  );*/
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#404040",
    flex: 1,
  },
  /*
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
  },*/
});

export default App;
