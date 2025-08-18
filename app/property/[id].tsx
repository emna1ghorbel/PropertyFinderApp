import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useReducer } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Linking,
} from 'react-native';
import { actionCreators, initialState, reducer } from '../../components/context/property';
import Ip from '../id';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Bath, BedSingle, CalendarFold, MapPinHouse } from 'lucide-react-native';

export default function FetchDetails() {
  const { id } = useLocalSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const ip = Ip();

  useEffect(() => {
    async function fetchPosts() {
      dispatch(actionCreators.loading());
      try {
        const response = await fetch(`http://${ip}:3000/api/v1/properties/${id}`);
        const data = await response.json();
        dispatch(actionCreators.success([data]));
      } catch (e) {
        dispatch(actionCreators.failure());
      }
    }
    if (id) {
      fetchPosts();
    }
  }, [id]);

  const { property, loading, error } = state;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Failed to load posts!</Text>
      </View>
    );
  }

  if (!property.length) return null;

  const propertyDetails = property[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={router.back}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {propertyDetails.images.map((uri: any, index: React.Key | null | undefined) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({ pathname: `../image/[id]`, params: { id: uri } })
            }
          >
            <Image source={{ uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.infoBar}>
        <View style={styles.infoItem}>
          <BedSingle size={20} color="black" />
          <Text style={styles.infoText}>{propertyDetails.bedrooms} Chambres</Text>
        </View>
        <View style={styles.infoItem}>
          <Bath size={20} color="black" />
          <Text style={styles.infoText}>{propertyDetails.bathrooms} Salles</Text>
        </View>
        <View style={styles.infoItem}>
          <CalendarFold size={20} color="black" />
          <Text style={styles.infoText}>{propertyDetails.yearBuilt}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome5
            name={propertyDetails.isAvailable ? 'check-circle' : 'times-circle'}
            size={24}
            color={propertyDetails.isAvailable ? 'green' : 'red'}
          />
          <Text style={styles.infoText}>
            {propertyDetails.isAvailable ? 'Disponible' : 'Non disponible'}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>{propertyDetails.title}</Text>
        <Text style={styles.description}>{propertyDetails.description}</Text>
        <Text style={styles.details}>{propertyDetails.price} $ par mois</Text>
        <View style={{ flexDirection: 'row' }}>
          <MapPinHouse size={20} color="black" />
          <Text>
            {propertyDetails.address}, {propertyDetails.city}
          </Text>
        </View>
        <Text style={styles.details}>Surface: {propertyDetails.squareFootage} m²</Text>
        <Text style={styles.details}>Type: {propertyDetails.propertyType}</Text>
        <Text style={styles.agentTitle}>Agent Immobilier</Text>
        <Text style={styles.details}>Nom: {propertyDetails.agentName}</Text>
        <Text style={styles.details}>Téléphone: {propertyDetails.agentPhone}</Text>
        <Text style={styles.details}>Email: {propertyDetails.agentEmail}</Text>
      </View>

      <View style={styles.contactBar}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${propertyDetails.agentPhone}`)}
        >
          <Ionicons name="call-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => Linking.openURL(`mailto:${propertyDetails.agentEmail}`)}
        >
          <Ionicons name="mail-outline" size={22} color="#fff" />
          <Text style={styles.emailText}>Envoyer Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 25,
    paddingHorizontal: 10,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 25,
    borderColor: '#1d3557',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#a8dadc',
  },
  backText: {
    fontSize: 16,
    color: '#1d3557',
    marginLeft: 8,
    fontWeight: '600',
  },
  imageScroll: {
    maxHeight: 250,
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 250,
    marginRight: 10,
    borderRadius: 12,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginTop: 4,
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1d3557',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 6,
  },
  details: {
    fontSize: 14,
    color: '#343a40',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  agentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#1d3557',
  },
  contactBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  callButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    elevation: 3,
  },
  emailText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
