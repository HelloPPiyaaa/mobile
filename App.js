import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView,FlatList, SafeAreaView, LogBox, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AudioList from './app/screens/AudioList';
import AudioProvider from './app/context/AudioProvider';
import AppNavigator from './app/navigation/AppNavigator';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './login';

// const MyTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: color.APP_BG,
//   },
// };

const firebaseConfig = {
  apiKey: "AIzaSyA1MIQNfo6g5vo6NM4trcmXkSnmYTqeORQ",
  authDomain: "project-mobilewebmusic.firebaseapp.com",
  databaseURL: "https://project-mobilewebmusic-default-rtdb.firebaseio.com",
  projectId: "project-mobilewebmusic",
  storageBucket: "project-mobilewebmusic.appspot.com",
  messagingSenderId: "582066992086",
  appId: "1:582066992086:web:85ed488569d1ba71cf2a77",
  measurementId: "G-QGCLH5P508"
};
LogBox.ignoreAllLogs(true);


try {
  firebase.initializeApp(firebaseConfig);
} catch (err) { }


function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}

export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [citem, setCitem] = React.useState(null);


  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
  }, []);

  if (user == null) {
    return <LoginScreen />;
  }
  if (citem != null) {
    return <Detail item={citem} setItem={setCitem} />;
  }

  return (
    <PaperProvider>
       
  
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />
      <AudioProvider>
      <NavigationContainer >
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
     
    {/* <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
          Sign Out
        </Button>
  
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />
  */}
       
       
    </PaperProvider>
    

    
  );
}