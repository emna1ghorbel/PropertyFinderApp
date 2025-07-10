import React, { useState } from "react";
import { Alert, Button, TextInput, View, StyleSheet } from "react-native";
import { signup } from "@/auth_signup_password"; // عدّل حسب مشروعك
import { useSession } from "../ctx";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { signIn } = useSession();

  const handleInscription = () => {
    signup(email, motDePasse)
      .then((userCredential) => {
        Alert.alert("Succès", `Compte créé pour ${userCredential.email}`);

        signIn();
      })
      .catch((error) => {
        Alert.alert("Erreur", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
        style={styles.input}
      />
      <Button title="Créer un compte" onPress={handleInscription} />
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
