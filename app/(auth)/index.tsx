import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';
export default function MyScreen() {
  const router = useRouter();
    return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
        style={styles.image} 
        resizeMode="contain"
      />
      <View style={styles.buttonsContainer}>
        <Button title="sign up" onPress={() => { router.push('/signup'); }} />
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="sign in" onPress={() => { router.push('/signin'); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',    
    padding: 10,
  },
  image: {
    width:200,
    height: 200,
    marginBottom: 20,
  },
  buttonsContainer: {
    
    width: '80%',
    marginTop: 20,
    flexDirection: 'column',    
    justifyContent: 'space-around', 
  },
});
