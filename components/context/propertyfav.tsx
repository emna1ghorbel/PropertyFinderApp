import { useRouter } from "expo-router";
import { useSession } from '@/components/context/ctx';
import RemoveFromFavorites from '@/app/users/remove';
import { useEffect, useState } from 'react';
import {AddToFirestore} from "@/app/users/add";
import useGetData from "@/app/users/get"
import { MapPin } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Property } from '@/constants/types';
import AntDesign from '@expo/vector-icons/AntDesign';

export function Propertyfav({ item }: { item: Property }) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const data: Property[] = useGetData("users", "fav");
  const exists = data.some(favItem => favItem.id === item.id);

  useEffect(() => {
    if (!session || isLoading) return;
    setIsFavorite(Boolean(exists));
  }, [data, session, isLoading, item.id]);

  const toggleFavorite = async (e: any) => {
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);

    if (!isFavorite) {
      await AddToFirestore("fav", item, "users", session ?? "");
    }
    if (isFavorite) {
      await RemoveFromFavorites(item, "users", "fav", session ?? "");
    }
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => router.push({ pathname: "/property/[id]", params: { id: item.id } })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <TouchableOpacity 
        onPress={toggleFavorite} 
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
      >
        <AntDesign 
          name="heart" 
          size={20} 
          color={isFavorite ? "#FFFFFF" : "rgba(255,255,255,0.8)"} 
        />
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <Text style={styles.price}>{item.price} $/mois</Text>
        
        <View style={styles.addressContainer}>
          <MapPin size={14} color="#03215F" />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    margin: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(3, 33, 95, 0.1)",
    shadowColor: "#03215F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(3, 33, 95, 0.6)",
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  favoriteButtonActive: {
    backgroundColor: "#FF385C",
  },
  detailsContainer: {
    padding: 12,
  },
  price: {
    fontWeight: "700",
    fontSize: 16,
    color: "#03215F",
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
    flexShrink: 1,
  },
});