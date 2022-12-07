import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import Home from '../screens/Home'
import Dispositivos from '../screens/Dispositivos'


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


