import React, { useEffect, useReducer, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { Property } from '@/constants/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import filter from 'lodash.filter';
import { actionCreators, initialState, reducer } from '../../components/context/property';
import { PropertyCard } from '../../components/context/propertycard';
import Ip from '../id';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const ip = Ip();

  const [fullData, setFullData] = useState<Property[]>([]);
  const [data, setData] = useState<Property[]>([]);

  const [title, setTitle] = useState("");

  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [addressFilter, setAddressFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (
    query: string,
    price: number | null,
    address: string,
    bedroom: number | null,
    type: string
  ) => {
    const formattedQuery = query.toLowerCase();
    let filtered = fullData;

    if (formattedQuery !== "") {
      filtered = filter(filtered, (property: Property) =>
        property.title.toLowerCase().includes(formattedQuery)
      );
    }

    if (price !== null) {
      filtered = filter(filtered, (property: Property) =>
        property.price <= price
      );
    }

    if (address !== "all") {
      filtered = filter(filtered, (property: Property) =>
        property.city.toLowerCase().includes(address.toLowerCase())
      );
    }

    if (bedroom !== null) {
      filtered = filter(filtered, (property: Property) =>
        property.bedrooms === bedroom
      );
    }

    if (type !== "all") {
      filtered = filter(filtered, (property: Property) =>
        property.propertyType.toLowerCase() === type.toLowerCase()
      );
    }

    setData(filtered);
  };

  const SearchBar = (query: string) => {
    setTitle(query);
  };

  const onPriceChange = (value: number | null) => {
    setPriceFilter(value);
  };

  const onAddressChange = (value: string) => {
    setAddressFilter(value);
  };

  const onBedroomChange = (value: number | null) => {
    setBedroomFilter(value);
  };

  const onTypeChange = (value: string) => {
    setTypeFilter(value);
  };

  const onApplyFilters = () => {
    applyFilters(title, priceFilter, addressFilter, bedroomFilter, typeFilter);
    setShowFilters(false);
  };

  useEffect(() => {
    async function fetchPosts() {
      dispatch(actionCreators.loading());
      try {
        const response = await fetch(`http://${ip}:3000/api/v1/properties?limit=100`);
        const json = await response.json();
        setFullData(json.items);
        
        dispatch(actionCreators.success(json.items));
      } catch (e) {
        dispatch(actionCreators.failure());
      }
    }
    fetchPosts();
  }, []);

  const { loading, error } = state;

  return (
    
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{fontWeight: 'bold', color: 'black', fontSize: 25, marginVertical: 20, marginTop: 40, textAlign: 'left' }}>recchercher votre propriété</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by title"
          value={title}
          style={styles.searchInput}
          onChangeText={SearchBar}
          clearButtonMode="always"
        />
        {title.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setTitle('');
              setData(fullData);
            }}
          >
            <AntDesign name="closecircle" size={20} color="gray" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.filterTitle}>Prix</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 1000 && styles.activeFilter]}
              onPress={() => onPriceChange(1000)}
            >
              <Text>≤ 1000$</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 3000 && styles.activeFilter]}
              onPress={() => onPriceChange(3000)}
            >
              <Text>≤ 3000$</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === 5000 && styles.activeFilter]}
              onPress={() => onPriceChange(5000)}
            >
              <Text>≤ 5000$</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, priceFilter === null && styles.activeFilter]}
              onPress={() => onPriceChange(null)}
            >
              <Text>Tout</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterTitle}>Ville</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, addressFilter === "tunis" && styles.activeFilter]}
              onPress={() => onAddressChange("tunis")}
            >
              <Text>Tunis</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, addressFilter === "sfax" && styles.activeFilter]}
              onPress={() => onAddressChange("sfax")}
            >
              <Text>Sfax</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, addressFilter === "sousse" && styles.activeFilter]}
              onPress={() => onAddressChange("sousse")}
            >
              <Text>Sousse</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, addressFilter === "all" && styles.activeFilter]}
              onPress={() => onAddressChange("all")}
            >
              <Text>Toutes</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterTitle}>Chambres</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, bedroomFilter === 1 && styles.activeFilter]}
              onPress={() => onBedroomChange(1)}
            >
              <Text>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, bedroomFilter === 2 && styles.activeFilter]}
              onPress={() => onBedroomChange(2)}
            >
              <Text>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, bedroomFilter === 3 && styles.activeFilter]}
              onPress={() => onBedroomChange(3)}
            >
              <Text>3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, bedroomFilter === null && styles.activeFilter]}
              onPress={() => onBedroomChange(null)}
            >
              <Text>Tout</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterTitle}>Type</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, typeFilter === "apartment" && styles.activeFilter]}
              onPress={() => onTypeChange("apartment")}
            >
              <Text>Appartement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, typeFilter === "house" && styles.activeFilter]}
              onPress={() => onTypeChange("house")}
            >
              <Text>Maison</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, typeFilter === "villa" && styles.activeFilter]}
              onPress={() => onTypeChange("villa")}
            >
              <Text>Villa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, typeFilter === "all" && styles.activeFilter]}
              onPress={() => onTypeChange("all")}
            >
              <Text>Tout</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={onApplyFilters}
          >
            <Text style={styles.applyButtonText}>Rechercher</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PropertyCard item={item} />}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft:10,
    marginRight:10,
   
  
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: 'black',
   
  },
  searchInput: {
    flex: 1,
    height: 40
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilter: {
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "black"
  },
  filterTitle: {
    marginTop: 10,
    fontWeight: 'bold'
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
