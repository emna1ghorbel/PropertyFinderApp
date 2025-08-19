import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '@/components/context/ctx';
import useGetData from "@/app/users/get";
import { User } from '@/constants/types';

const PRIMARY_COLOR = '#03215F';

const LIGHT_BACKGROUND = 'rgba(3, 33, 95, 0.1)';

export default function UserProfile() {
  const { session, isLoading, signOut } = useSession();
  const data: User[] = useGetData("users", "user");
  const user = true ? data[0] : null;

  return (
    <View style={styles.container}>
      
        <View style={styles.card}>
          <ImageBackground
            source={require('@/assets/images/homee.jpg')}
            style={styles.headerBackground}
            imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            blurRadius={2}
          >
            <View style={styles.headerOverlay} />
          </ImageBackground>

          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              {user?.image ? (
                <Image source={{ uri: user.image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={50} color={PRIMARY_COLOR} />
                </View>
              )}
            </View>

            <Text style={styles.name}>{user?.name || "User"}</Text>
            <Text style={styles.email}>{user?.email || "Email not available"}</Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="location" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.infoText}>{user?.address?.info || "Address not available"}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.infoText}>
                  age:{user?.age   || "Age not available"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Ionicons name="log-out" size={20} color="#FFF" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
 
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  headerBackground: {
    height: 150,
    width: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 33, 95, 0.4)',
  },
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: -60,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: LIGHT_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_BACKGROUND,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  signOutText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
});
