import React, { useState, useEffect } from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import { View, StyleSheet, Image, Text, SafeAreaView } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from 'react-native-gesture-handler';
import api from "../../service/api";
import * as MailComposer from "expo-mail-composer";

interface Points {
  point: {
    id: number;
    image: string;
    name: string;
    whatsapp: string;
    uf: string;
    city: string;
    email: string;
  };
  items: {
    title: string;
  }[];
}

interface Param {
  point_id: number;
}

const Detail = () => {

  const route = useRoute();

  const [pointDetail, setPointDetail] = useState<Points>({} as Points);

  const routeParam = route.params as Param;

  const navigation = useNavigation();

  useEffect(() => {
    api.get(`points/${routeParam.point_id}`)
      .then(response => {
        console.log(response.data);
        setPointDetail(response.data);
      })
  }, []);

  function handleGoBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: "Interesse na coleta de resíduos",
      recipients: [pointDetail.point.email],
    })
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${pointDetail.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`);
  }

  if (!pointDetail.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80" }} />
        <Text style={styles.pointName}>{pointDetail.point.name}</Text>
        <Text style={styles.pointItems}>
          {pointDetail.items.map(item => item.title).join(", ")}
        </Text>

        <View>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{pointDetail.point.city + ", " + pointDetail.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton onPress={handleWhatsapp} style={styles.button}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"></FontAwesome>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton onPress={handleComposeMail} style={styles.button}>
          <Icon name="mail" size={20} color="#FFF"></Icon>
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;