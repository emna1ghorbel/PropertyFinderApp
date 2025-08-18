import { Property } from '@/constants/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import filter from 'lodash.filter';
import React, { useEffect, useReducer, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { actionCreators, initialState, reducer } from '../../components/context/property';
import { PropertyCard } from '../../components/context/propertycard';
import Ip from '../id';

const PRIMARY_COLOR = '#03215F';
const SECONDARY_COLOR = '#4E8CFF';
const LIGHT_GRAY = '#F5F5F5';

export default function PropertySearchScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const ip = Ip();

  const [fullData, setFullData] = useState<Property[]>([]);
  const [data, setData] = useState<Property[]>([]);
  const [title, setTitle] = useState("");

  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (
    query: string,
    price: number | null,
    city: string,
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

    if (city !== "all") {
      filtered = filter(filtered, (property: Property) =>
        property.city.toLowerCase().includes(city.toLowerCase())
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

 
   const handleSearch = (query: string) => {
     setTitle(query);
     
     
     
       const filteredData = filter(fullData, (property: Property) =>
         property.title.toLowerCase().includes(query.toLowerCase())
      );
       setData(filteredData);
     }
   ;

  const onPriceChange = (value: number | null) => {
    setPriceFilter(value);
  };

  const onCityChange = (value: string) => {
    setCityFilter(value);
  };

  const onBedroomChange = (value: number | null) => {
    setBedroomFilter(value);
  };

  const onTypeChange = (value: string) => {
    setTypeFilter(value);
  };

  const onApplyFilters = () => {
    applyFilters(title, priceFilter, cityFilter, bedroomFilter, typeFilter);
    setShowFilters(false);
  };

  const resetSearch = () => {
    setTitle('');
    setData(fullData);
  };

  useEffect(() => {
    async function fetchProperties() {
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
    fetchProperties();
  }, []);

  const { loading, error } = state;

  return (
    
     
        <View style={styles.container}>
       
          <View style={styles.header}>
            <Text style={styles.title}>Find Your Property</Text>
            <Text style={styles.subtitle}>Discover your dream home</Text>
          </View>

       
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by title..."
              placeholderTextColor="#999"
              value={title}
              style={styles.searchInput}
              onChangeText={handleSearch}
              clearButtonMode="while-editing"
            />
            {title.length > 0 && (
              <TouchableOpacity onPress={resetSearch}>
                <AntDesign name="closecircle" size={18} color="#999" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => setShowFilters(!showFilters)} 
              style={styles.filterButton}
            >
              <Ionicons name="filter" size={20} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>

   
          {showFilters && (
            <View style={styles.filtersContainer}>
              <Text style={styles.filterTitle}>Price</Text>
              <View style={styles.filterRow}>
                {[1000, 3000, 5000, null].map((price) => (
                  <TouchableOpacity
                    key={price || 'all'}
                    style={[
                      styles.filterOption,
                      priceFilter === price && styles.activeFilterOption
                    ]}
                    onPress={() => onPriceChange(price)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      priceFilter === price && styles.activeFilterOptionText
                    ]}>
                      {price ? `≤ $${price}` : 'All'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterTitle}>City</Text>
              <View style={styles.filterRow}>
                {['tunis', 'sfax', 'sousse', 'all'].map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.filterOption,
                      cityFilter === city && styles.activeFilterOption
                    ]}
                    onPress={() => onCityChange(city)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      cityFilter === city && styles.activeFilterOptionText
                    ]}>
                      {city === 'all' ? 'All' : city.charAt(0).toUpperCase() + city.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterTitle}>Bedrooms</Text>
              <View style={styles.filterRow}>
                {[1, 2, 3, null].map((bedroom) => (
                  <TouchableOpacity
                    key={bedroom || 'all'}
                    style={[
                      styles.filterOption,
                      bedroomFilter === bedroom && styles.activeFilterOption
                    ]}
                    onPress={() => onBedroomChange(bedroom)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      bedroomFilter === bedroom && styles.activeFilterOptionText
                    ]}>
                      {bedroom || 'All'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterTitle}>Type</Text>
              <View style={styles.filterRow}>
                {['apartment', 'house', 'villa', 'all'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      typeFilter === type && styles.activeFilterOption
                    ]}
                    onPress={() => onTypeChange(type)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      typeFilter === type && styles.activeFilterOptionText
                    ]}>
                      {type === 'apartment' ? 'Apartment' : 
                       type === 'house' ? 'House' :
                       type === 'villa' ? 'Villa' : 'All'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={onApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          )}

       
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.propertyCard}>
                <PropertyCard item={item} />
              </View>
            )}
            
            contentContainerStyle={styles.propertyList}
          />
        </View>
    
   
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  filterButton: {
    marginLeft: 12,
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterOption: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterOption: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterOptionText: {
    color: '#FFF',
  },
  applyButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  propertyList: {
    paddingBottom: 24,
  },
  propertyCard: {
    marginBottom: 16,
  },
});