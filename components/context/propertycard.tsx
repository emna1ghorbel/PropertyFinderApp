import { useRouter } from "expo-router";
import { useSession } from '@/components/context/ctx';
import RemoveFromFavorites from '@/app/users/remove';
import { useEffect, useState } from 'react';
import {AddToFirestore} from "@/app/users/add";
import useGetData from "@/app/users/get"
import { BedSingle, MapPinHouse, Bath, CalendarFold, Heart } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Property } from '@/constants/types';
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

const db = getFirestore();

export function PropertyCard({ item }: { item: Property }) {
  const router = useRouter();
  const { session, isLoading } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const data: Property[] = useGetData("users", "fav");
  const exists = data.some(favItem => favItem.id === item.id);

  useEffect(() => {
    if (!session || isLoading) return;
    setIsFavorite(Boolean(exists));
  }, [data, session, isLoading, item.id]);

  const toggleFavorite = async () => {
    const newState = !isFavorite;
    setIsFavorite(newState);

    if (!isFavorite) {
      await AddToFirestore("fav", item, "users", session ?? "");
    }
    if (isFavorite) {
      await RemoveFromFavorites(item, "users", "fav",session ?? "");
    }
  };

  return (
    <TouchableOpacity
      key={item.id}
      style={styles.post}
      onPress={() => router.push({ pathname: "/property/[id]", params: { id: item.id } })}
    >
      <View style={styles.cardContent}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        
        <TouchableOpacity 
          onPress={toggleFavorite} 
          style={styles.favoriteButton}
        >
          <AntDesign 
            name="heart" 
            size={24} 
            color={isFavorite ? "#FF385C" : "rgba(255,255,255,0.8)"} 
          />
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{item.price} $/mois</Text>
          </View>

          <View style={styles.addressRow}>
            <MapPinHouse size={18} color="#03215F" />
            <Text style={styles.address}>{item.address}, {item.city}</Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <BedSingle size={18} color="#03215F" />
              <Text style={styles.infoText}>{item.bedrooms}</Text>
            </View>

            <View style={styles.infoItem}>
              <Bath size={18} color="#03215F" />
              <Text style={styles.infoText}>{item.bathrooms}</Text>
            </View>

            <View style={styles.infoItem}>
              <CalendarFold size={18} color="#03215F" />
              <Text style={styles.infoText}>{item.yearBuilt}</Text>
            </View>

            <View style={styles.infoItem}>
              {item.isAvailable ? (
                <>
                  <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
                  <Text style={[styles.infoText, { color: "#4CAF50" }]}>Available</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="cancel" size={18} color="#F44336" />
                  <Text style={[styles.infoText, { color: "#F44336" }]}>Not Available</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowColor: "#03215F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(3, 33, 95, 0.1)",
  },
  cardContent: {
    padding: 12,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(3, 33, 95, 0.6)",
    borderRadius: 20,
    padding: 6,
  },
  detailsContainer: {
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#03215F",
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3671e6ff",
    marginLeft: 8,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(3, 33, 95, 0.05)",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#03215F",
    marginLeft: 4,
  },
});