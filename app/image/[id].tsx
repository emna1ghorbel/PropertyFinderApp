import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, View, StyleSheet, TouchableOpacity , Text } from 'react-native';

import React from 'react';

export default function ImageScreen() {
  const { id } = useLocalSearchParams();

const imageUrl = Array.isArray(id) ? id[0] : id;
console.log('id', id);
console.log('imageUrl', imageUrl);


;
 console.log('imageUrl', imageUrl);
  return (
    
    <View style={styles.container}>
        <TouchableOpacity style={styles.back  }  onPress={router.back} >
             <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.description}>  go back</Text>
            </TouchableOpacity>
      <Image
        source={{ uri:imageUrl}}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
 flex: 1,
    backgroundColor: 'white',
    marginTop:25,
    marginBottom:10,
  },
 back:{
   flexDirection: 'row',
   margin:20,
   borderRadius: 25,
   borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'rgba(126, 156, 216, 1)',
    marginRight:250,
   
  },
  description: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});