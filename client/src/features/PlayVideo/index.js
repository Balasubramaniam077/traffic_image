import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

export default function PlayVideo({navigation, route}) {
  const [videoId, setVideoId] = useState('');
  useEffect(() => {
    if (route.params.Id === 'stop') {
      setVideoId('14NuDq4j2gY');
    } else {
      setVideoId('14NuDq4j2gY');
    }
  }, [route.params.Id]);

  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          color: '#000000',
          fontWeight: 'bold',
          paddingTop: 50,
        }}>
        {route.params.Id}
      </Text>
      <View style={{width: '95%', alignSelf: 'center', paddingTop: 30}}>
        <YoutubePlayer height={300} play={true} videoId={videoId} />
      </View>
      <View style={{alignSelf: 'center'}}>
        <TouchableOpacity
          style={styles.subbutton}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 17}}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subbutton: {
    borderRadius: 10,
    width: 300,
    height: 40,
    backgroundColor: '#34B27B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
