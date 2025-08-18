import React, { useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Propertyfav } from '@/components/context/propertyfav';
import { Property, User } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import filter from 'lodash.filter';
import Animated from 'react-native-reanimated';
import { actionCreators, initialState, reducer } from '../../components/context/property';
import { PropertyCard } from '../../components/context/propertycard';
import Ip from '../id';
import useGetData from '../users/get';
import { useGetPropertiesQuery } from '../src/property';
import { AppDispatch, RootState } from '../src/store';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@/components/context/ctx';
import { startFavsListener, selectFavs } from '../src/firestore';
import { LinearGradient } from 'expo-linear-gradient';
const PRIMARY_COLOR = '#03215F';
const SECONDARY_COLOR = '#4E8CFF';
const LIGHT_GRAY = '#F5F5F5';
export default function App2() {
  const dispatch = useDispatch<AppDispatch>();
  const { session, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const favs = useSelector(selectFavs); 

  const [state, reducerDispatch] = useReducer(reducer, initialState);
  const ip = Ip();
  const [page, setPage] = useState(1);
  const [data1, setData1] = useState<Property[]>([]);
  const [fullData, setFullData] = useState<Property[]>([]);
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, error, isLoading } = useGetPropertiesQuery(page, {
    refetchOnMountOrArgChange: true,
  });

  const data2: User[] = useGetData("users", "user");//info user
// fav store
  useEffect(() => {
    if (session) {
      const unsubscribe = startFavsListener(session, dispatch);
      return () => unsubscribe();
    }
  }, [session]);
// pour le changement de data ily jet mn store
  useEffect(() => {
    if (data) {
      const newData = page === 1 ? data : [...fullData, ...data];
      setFullData(newData);
      
      if (searchQuery) {
        const filteredData = filter(newData, (property: Property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setData1(filteredData);
      } else {
        setData1(newData);
      }
    }
  }, [data, page]);

  const handleSearch = (query: string) => {
    setTitle(query);
    setSearchQuery(query);
    
    if (query === '') {
      setData1(fullData);
    } else {
      const filteredData = filter(fullData, (property: Property) =>
        property.title.toLowerCase().includes(query.toLowerCase())
      );
      setData1(filteredData);
    }
  };

  const resetSearch = () => {
    setTitle('');
    setSearchQuery('');
    setData1(fullData);
  };

  
if (sessionLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load posts!</Text>
      </View>
    );
  }

  const listHeader = favs.length > 0 ? () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your favorite properties</Text>
        <TouchableOpacity onPress={() => router.push('/fav')}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={favs}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Propertyfav item={item} />
          </View>
        )}
      />
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Our properties</Text>
    </View>
  ) : null;

  return (
    <View style={styles.view}>
     
        <View style={styles.container}>
        
          <View style={styles.header}>
            <Text style={styles.welcomeText}>
              Welcome back, {data2.length > 0 ? data2[0].name : 'User'}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.locationText}>
                {data2.length > 0 ? data2[0].address.info : 'Your current location'}
              </Text>
            </View>
            <Text style={styles.subtitle}>Find your perfect place</Text>
          </View>

        
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by title"
              placeholderTextColor="#999"
              value={title}
              style={styles.searchInput}
              onChangeText={handleSearch}
              clearButtonMode="while-editing"
            />
            {title.length > 0 && (
              <TouchableOpacity onPress={resetSearch} style={styles.clearButton}>
                <AntDesign name="closecircle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>

         
          <FlatList
            data={data1}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.propertyItem}>
                <PropertyCard item={item} />
              </View>
            )}
            ListHeaderComponent={listHeader}
            onEndReached={() => setPage(prev => prev + 1)}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.listContent}
          />
        </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#f1f4f6ff',
  },
 
  container: {
    flex: 1,
 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LIGHT_GRAY,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    marginHorizontal: 8,
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
  },
  clearButton: {
    padding: 4,
  },
  sectionContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  seeAll: {
    fontSize: 16,
    color: SECONDARY_COLOR,
    fontWeight: '500',
  },
  horizontalList: {
    paddingBottom: 8,
  },
  favoriteItem: {
    marginRight: 12,
  },
  propertyItem: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});