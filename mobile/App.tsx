//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,StatusBar} from 'react-native';
import {Ubuntu_700Bold,useFonts} from "@expo-google-fonts/ubuntu";
import {Roboto_400Regular,Roboto_500Medium} from "@expo-google-fonts/roboto";
import Routes from "./src/routes"
import { AppLoading } from 'expo';

export default function App() {
  const [fontsloaded] = useFonts({
    Ubuntu_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
  });

  if(!fontsloaded) return <AppLoading/>
''
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes/>
    </>    
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
