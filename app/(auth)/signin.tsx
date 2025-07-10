import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { useSession } from "../ctx";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { signIn } = useSession();

  console.log("SignIn component rendered");


  return (
    <View style={styles.container}>
      <TextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      style={styles.input}
      keyboardType="email-address"
      
      />
      <TextInput
      placeholder="Mot de passe"
      secureTextEntry
      value={motDePasse}
      onChangeText={setMotDePasse}
      style={styles.input}
      />
      <Button
      title="Se connecter"
      onPress={() => {
        signIn(email, motDePasse);
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

