import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/components/context/ctx';
import useGetData from "@/app/users/get";
import { User } from '@/constants/types';

export default function UserProfile() {
  const { session, isLoading, signOut } = useSession();
  const data: User[] = useGetData("users", "user");

  const user = data.length > 0 ? data[0] : null;

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <ImageBackground
          source={require('@/assets/images/homee.jpg')}
          style={styles.cardBackground}
          imageStyle={{ borderRadius: 20 }}
          blurRadius={3}
        >
          <View style={styles.cardContent}>
            <View style={styles.imageWrapper}>
              {user?.image ? (
                <Image source={{ uri: user.image }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={120} color="#fff" />
              )}
            </View>

            <Text style={styles.title}>{user?.name || "Utilisateur"}</Text>
            <Text style={styles.subtitle}>{user?.email || "Email non disponible"}</Text>

            <View style={styles.info}>
              <View style={styles.ligne}>
                <Ionicons name="location-outline" size={22} color="#fff" />
                <Text style={styles.label}>{user?.address?.info || "Adresse non disponible"}</Text>
              </View>
              <View style={styles.ligne}>
                <Ionicons name="calendar-outline" size={22} color="#fff" />
                <Text style={styles.label}>{user?.age ? new Date(user.age).toLocaleDateString() : "Non disponible"}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Ionicons name="exit-outline" size={22} color="#fff" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  cardWrapper: { width: '90%' },
  cardBackground: {
    width: '100%',
    borderRadius: 20,
  },
  cardContent: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 253, 0)',
    borderRadius: 20,
  },
  imageWrapper: {
    marginTop: -80,
    marginBottom: 15,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: { width: 140, height: 140, borderRadius: 70 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: 'white', marginBottom: 20 },
  info: { width: '100%', marginVertical: 15 },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 15, 15, 0.36)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: { color: '#fff', fontSize: 16, marginLeft: 10 },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1027f2ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  signOutText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
});
