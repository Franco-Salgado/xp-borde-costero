import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native'
import Home from '../screens/Home'
import Dispositivos from '../screens/Dispositivos'
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

const Stack = createNativeStackNavigator()
const MainStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen 
                    name = 'Home'
                    component = { Home }
                />
                <Stack.Screen 
                    name = 'Dispositivos'
                    component = { Dispositivos }
                />
            </Stack.Navigator>
        </NavigationContainer>

    )
}

export default MainStack