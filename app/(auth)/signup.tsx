import React, { useState } from "react";
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image, 
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useSession } from "../../components/context/ctx";
import { signupwithfirebase } from "@/auth_signup_password";
import { setuser } from "@/app/users/add";
import { User, Address } from "@/constants/types";
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState<Address | null>(null);
  const [addressText, setAddressText] = useState(""); 
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { signUp } = useSession();

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      let geo = await Location.reverseGeocodeAsync({ 
        latitude: loc.coords.latitude, 
        longitude: loc.coords.longitude 
      });
      if (geo.length > 0) {
        const info = geo[0];
        const userAddress: Address = {
          info: `${info.name || ""} ${info.street || ""}, ${info.city || ""}, ${info.country || ""}`,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setAddress(userAddress);
        setAddressText(userAddress.info);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      quality: 0.8, 
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignUp = () => {
    if (!address || !birthDate) return;
    signupwithfirebase(email, password)
      .then((userCredential) => {
        signUp(email, password);
        const newUser: User = { 
          name, 
          address, 
          email, 
          age: String(2025-birthDate.getFullYear()), 
          image: image ?? "" 
        };
        setuser("users", userCredential.uid, "user", newUser);
        router.push("/signin");
      })
      .catch((error) => console.error(error));
  };

  return (
          <ImageBackground 
        source={require('@/assets/images/17kW_to_20kW_Lifestyle_1__67672__56799.jpg')} 
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0, 81, 255, 0.7)']}
          style={styles.gradient}
        />
        
        <View style={styles.content}>
          <View style={styles.card}>
            <Ionicons 
              name="arrow-back" 
              size={28} 
              color="#fff" 
              onPress={router.back}
              style={styles.backButton}
            />

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community to find your perfect home</Text>

            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="camera" size={32} color="#fff" />
                  <Text style={styles.avatarText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.inputIcon} />
              <TouchableOpacity 
                style={[styles.input, { justifyContent: 'center' }]} 
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: birthDate ? "#fff" : "rgba(255,255,255,0.7)" }}>
                  {birthDate ? birthDate.toDateString() : "Date of Birth"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker 
                  value={birthDate || new Date()} 
                  mode="date" 
                  display="default" 
                  maximumDate={new Date()} 
                  onChange={(event, date) => { 
                    setShowDatePicker(false); 
                    if (date) setBirthDate(date); 
                  }} 
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                placeholder="Address"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={addressText}
                style={[styles.input, { flex: 1 }]}
                editable={false}
              />
              <TouchableOpacity 
                style={styles.locationButton} 
                onPress={handleGetLocation} 
                disabled={loadingLocation}
              >
                {loadingLocation ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="locate" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleSignUp}
              disabled={!email || !password || !name || !address || !birthDate}
            >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/signin")}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
 card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 0,
  },
  locationButton: {
    padding: 10,
    marginLeft: 5,
  },
  primaryButton: {
    backgroundColor: 'rgba(3, 33, 95, 0.9)',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'rgba(255,255,255,0.8)',
    marginRight: 5,
  },
  loginLink: {
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});