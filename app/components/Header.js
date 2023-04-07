import { StyleSheet, Text, View, SafeAreaView,ScrollView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const Header = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8a0a0a','#111','#111','#111','#111','#111',]}
        start={{x: -0.1, y: 0.2}}
        end={{x: 1, y: 1}}
        locations={[0.01,0.2,0.3,1,1,1]}
      >
        </LinearGradient>
      <View style={styles.subContainer}></View>
      
    <View style={styles.topCont}>
        <View>
          <Text style={styles.text}>Hello</Text>
        </View>
        <View style={styles.iconCont}>
          <MaterialIcons style={styles.icon} name="account-circle" size={24} color="white" />
        </View>
      </View>
      </SafeAreaView>
  )
  }

export default Header

const styles = StyleSheet.create({
    topCont:{
        flexDirection:"row",
        alignItems:"center",
        paddingTop: 40,
        justifyContent:"space-between"
      },
      text:{
        color:"white",
        fontSize:22,
        fontWeight:"bold",
      },
      iconCont:{
        flexDirection:"row"
      },
      icon:{
        marginLeft:15
      },
      container: {
        flex: 1,
        backgroundColor: "#111", 
      },
      subContainer:{
        paddingRight: 15,
        paddingLeft:15
      },
})