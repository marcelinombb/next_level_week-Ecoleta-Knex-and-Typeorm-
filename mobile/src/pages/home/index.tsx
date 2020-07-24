import React, { useEffect, useState } from 'react';
import { View ,Image, StyleSheet,Text, ImageBackground} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {Feather as Icon} from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import api from "axios"; 

interface UFs{
    sigla:string;
} 
interface Cities{
  nome:string;
}

const Home = () => {

  const [selectedUF,setSelectedUF] = useState('0');
  const [UFs,setUFs] = useState<string[]>([]);
  const [Cities,setCities] = useState<string[]>([]);
  const [selectedCity,setSelectedCity] = useState('0');

  useEffect(()=>{
    api.get<UFs[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response=>{
            const ufInitials = response.data.map(uf=>uf.sigla);
            setUFs(ufInitials);
        })
  },[])

  function handleSelectedUF(uf:string){
    if(uf==="0") return setSelectedCity("0");
    setSelectedUF(uf);
  }

  function handleSelectedCity(city:string){
    setSelectedCity(city);
  }

  useEffect(()=>{

    if(selectedUF==='0') return

    api.get<Cities[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
    .then(response=>{
        const citiesNames = response.data.map(city=>city.nome);
        setCities(citiesNames);
    })
},[selectedUF]);

  const navigation = useNavigation()

  function handleNavigateToPoints(){
    navigation.navigate("Points",{
      uf:selectedUF,
      city:selectedCity
    });
  }

  return (
  <ImageBackground source={require("../../assets/home-background.png")} imageStyle={{width:274,height:368}} style={styles.container}>
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")}/>
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>ajudamos pessoas a encontrar pontos de forma eficiente</Text>
      </View>
      <View style={styles.select}>
        <RNPickerSelect
          onValueChange={(value) => handleSelectedUF(value)}
          style={selectedUF!="0" ? {inputAndroid : styles.inputAndroid}:{}}
          items={UFs.map(uf=>{
            return {label:uf,value:uf}}
            )}
            placeholder={{label: 'Selecione um Estado', value: "0"}}
        />
        <RNPickerSelect
          style={selectedCity!=="0" ? {inputAndroid : styles.inputAndroid}:{}}
          onValueChange={(value) => handleSelectedCity(value)}
          items={Cities.map(city=>{
            return {label:city,value:city}}
            )}
            placeholder={{label: 'Selecione uma Cidade', value: "0"}}
        />
      </View>
      <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleNavigateToPoints} 
            enabled={selectedCity!=="0" ? true : false}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" size={24} color="#FFF"></Icon>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
      </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#34CB79',
    borderRadius: 8,
    color: '#34CB79',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;