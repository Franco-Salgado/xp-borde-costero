import React from "react";
import {Text, View, StyleSheet,TouchableOpacity} from 'react-native';



export default function TomarMuestra({onPress}) {

    return (
        <TouchableOpacity onPress={onPress} style = {{...styles.button,backgroundColor: '#d3d3d3'}}>
            <View >
                <Text style = {{...styles.buttonText,color:'#404040'}}>Tomar Muestra</Text>
            </View>
        </TouchableOpacity>
    )
}

/*export function Dispositivo({onPress}) {

    return (
        <TouchableOpacity onPress={onPress} style = {{...styles.button,backgroundColor: '#d3d3d3'}}>
            <View >
                <Text style = {{...styles.buttonText,color:'#404040'}}>Tomar Muestra</Text>
            </View>
        </TouchableOpacity>
    )
}*/

const styles = StyleSheet.create({
    button:{
        alignSelf:'center',
        paddingVertical: 15,
        width: '60%',
        borderRadius: 10

    },
    buttonText: {
        fontWeight: 'bold',
        
        fontSize: 25,
        textAlign: "center",
    }
})



