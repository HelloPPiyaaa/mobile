import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import Screen from '../components/Screen';
import color from '../misc/color';
import musicimg from '../../assets/apple-music-note.png'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import {
    changeAudio,
    moveAudio,
    pause,
    play,
    playNext,
    resume,
} from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';
import { selectAudio } from '../misc/audioController';

const { width } = Dimensions.get('window');

const Player = () => {
    const [currentPosition, setCurrentPosition] = useState(0);
    const context = useContext(AudioContext);
    const { playbackPosition, playbackDuration, currentAudio } = context;

    const calculateSeebBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }

        if (currentAudio.lastPosition) {
            return currentAudio.lastPosition / (currentAudio.duration * 1000);
        }

        return 0;
    };

    useEffect(() => {
        context.loadPreviousAudio();
    }, []);

    const handlePlayPause = async () => {
        await selectAudio(context.currentAudio, context);



    };

    const handleNext = async () => {
        await changeAudio(context, 'next');



    };

    const handlePrevious = async () => {
        await changeAudio(context, 'previous');
        // const { isLoaded } = await context.playbackObj.getStatusAsync();
        // const isFirstAudio = context.currentAudioIndex <= 0;
        // let audio = context.audioFiles[context.currentAudioIndex - 1];
        // let index;
        // let status;

        // if (!isLoaded && !isFirstAudio) {
        //   index = context.currentAudioIndex - 1;
        //   status = await play(context.playbackObj, audio.uri);
        // }

        // if (isLoaded && !isFirstAudio) {
        //   index = context.currentAudioIndex - 1;
        //   status = await playNext(context.playbackObj, audio.uri);
        // }

    };

    const renderCurrentTime = () => {
        if (!context.soundObj && currentAudio.lastPosition) {
            return convertTime(currentAudio.lastPosition / 1000);
        }
        return convertTime(context.playbackPosition / 1000);
    };

    if (!context.currentAudio) return null;

    return (
        
        <Screen>
            <View style={styles.container}>
                <View style={styles.audioCountContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        {context.isPlayListRunning && (
                            <>
                                <Text style={{ fontWeight: 'bold' }}>From Playlist: </Text>
                                <Text>{context.activePlayList.title}</Text>
                            </>
                        )}
                    </View>
                    <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1
                        } / ${context.totalAudioCount}`}</Text>
                </View>


                <View style={styles.midBannerContainer}>
                <Image source={musicimg} style={styles.songimage} />
                </View>
                <View style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.audioTitle}>
                        {context.currentAudio.filename}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 15,
                        }}
                    >
                        <Text style={{color:"white"}}>{convertTime(context.currentAudio.duration)}</Text>
                        <Text style={{color:"white"}}>
                            {currentPosition ? currentPosition : renderCurrentTime()}
                        </Text>
                    </View>
                    <Slider
                        style={{ width: width, height: 40 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={calculateSeebBar()}
                        minimumTrackTintColor={"color.FONT_MEDIUM"}
                        maximumTrackTintColor={color.ACTIVE_BG}
                        onValueChange={value => {
                            setCurrentPosition(
                                convertTime(value * context.currentAudio.duration)
                            );
                        }}
                        onSlidingStart={async () => {
                            if (!context.isPlaying) return;

                            try {
                                await pause(context.playbackObj);
                            } catch (error) {
                                console.log('error inside onSlidingStart callback', error);
                            }
                        }}
                        onSlidingComplete={async value => {
                            await moveAudio(context, value);
                            setCurrentPosition(0);
                        }}
                    />
                    <View style={styles.audioControllers}>
                        <PlayerButton iconType='PREV' onPress={handlePrevious} />
                        <PlayerButton
                            onPress={handlePlayPause}
                            style={{ marginHorizontal: 25 }}
                            iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
                        />
                        <PlayerButton iconType='NEXT' onPress={handleNext} />
                    </View>
                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    audioControllers: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        
    },
    audioCountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        
    },
    container: {
        flex: 1,
    },
    audioCount: {
        textAlign: 'right',
        color: color.FONT_LIGHT,
        fontSize: 14,
        
    },
    midBannerContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 30,
        marginVertical: 20,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'space-between',
        
    },
    audioTitle: {
        fontSize: 15,
        marginLeft: 10,
        color: color.FONT,
        
    },
    songimage: {
        width: 300,
        height: 350,
        borderRadius: 40,
        marginLeft: 19,
    },
});

export default Player;
