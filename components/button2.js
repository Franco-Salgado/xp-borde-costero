import React from "react";
import {Text, View, StyleSheet,TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';


export default function Dispositivo({text, onPress}) {
    /*const [fontsLoaded] = useFonts({
        Font1: require('./assets/fonts/ReachStory.ttf'),
      });*/
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.button}>
                <Text style ={styles.buttonText}>{ text }</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    button: {
        
        paddingVertical: 20,
        backgroundColor: '#d3d3d3',
        paddingHorizontal: 20,
        alignSelf: "center"
    },
    buttonText: {
        color: 'light-blue',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 25,
        textAlign: "center",
        textShadowColor: "white",
        textShadowRadius: 10
        
    }
});