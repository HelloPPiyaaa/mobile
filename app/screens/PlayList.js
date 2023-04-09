import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  LogBox
} from 'react-native';
import PlayListInputModal from '../components/PlayListInputModal';
import { AudioContext } from '../context/AudioProvider';
import color from '../misc/color';
import PlayListDetail from '../components/PlayListDetail';
import { Button } from 'react-native-paper';
import LoginScreen from '../../login';
import { getDatabase, ref, onValue, set } from 'firebase/database';

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

let selectedPlayList = {};
const PlayList = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPlayList, setShowPlayList] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;

  const createPlayList = async playListName => {
    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];
      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem('playlist');
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: 'My Favorite',
        audios: [],
      };

      const newPlayList = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPlayList] });
      return await AsyncStorage.setItem(
        'playlist',
        JSON.stringify([...newPlayList])
      );
    }

    updateState(context, { playList: JSON.parse(result) });
  };

  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

  const handleBannerPress = async playList => {
    if (addToPlayList) {
      const result = await AsyncStorage.getItem('playlist');

      let oldList = [];
      let updatedList = [];
      let sameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);

        updatedList = oldList.filter(list => {
          if (list.id === playList.id) {
            // we want to check is that same audio is already inside our list or not.
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                // alert with some message
                sameAudio = true;
                return;
              }
            }

            // otherwise update the playlist.
            list.audios = [...list.audios, addToPlayList];
          }

          return list;
        });
      }

      if (sameAudio) {
        Alert.alert(
          'Found same audio!',
          `${addToPlayList.filename} is already inside the list.`
        );
        sameAudio = false;
        return updateState(context, { addToPlayList: null });
      }

      updateState(context, { addToPlayList: null, playList: [...updatedList] });
      return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));
    }

    // if there is no audio selected then we want open the list.
    selectedPlayList = playList;
    // setShowPlayList(true);
    navigation.navigate('PlayListDetail', playList);
  };

  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) { }


  function dbListener(path, setData) {
    const tb = ref(getDatabase(), path);
    onValue(tb, (snapshot) => {
      setData(snapshot.val());
    })
  }
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
    <ScrollView contentContainerStyle={styles.container}>
      {playList.length
        ? playList.map(item => (
          <TouchableOpacity
            key={item.id.toString()}
            style={styles.playListBanner}
            onPress={() => handleBannerPress(item)}
          >
            <Text style={styles.audioTitle}>
              {item.title}</Text>
            <Text style={styles.audioCount}>
              {item.audios.length > 1
                ? `${item.audios.length} Songs`
                : `${item.audios.length} Song`}
            </Text>
          </TouchableOpacity>
        ))
        : null}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.playListBtn}>+ Add New Playlist</Text>
      </TouchableOpacity>

      <PlayListInputModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={createPlayList}
      />
      <PlayListDetail
        visible={showPlayList}
        playList={selectedPlayList}
        onClose={() => setShowPlayList(false)}
      />


      <Button style={styles.Buttonlogout} icon="logout" mode="contained" onPress={() => getAuth().signOut()} >Log Out</Button>





    </ScrollView>



  );






};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "white",
  },
  playListBanner: {
    padding: 5,
    backgroundColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
  },
  audioCount: {
    marginTop: 3,
    opacity: 0.7,
    fontSize: 14,
    color: "white",
  },
  playListBtn: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
  Buttonlogout: {
    backgroundColor: "red",
    marginTop: 380,
  },

  audioTitle: {
    color: "white",
    fontSize: 20,
    marginBottom: 10,
  },



});

export default PlayList;
