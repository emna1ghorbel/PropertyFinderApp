import useGetData from '@/app/users/get';
import { PropertyCard } from '../../components/context/propertycard';
import Animated from 'react-native-reanimated';
import {FlatList, View,Text} from 'react-native';

export default function App() {
  const data = useGetData("users","fav");

  return (
     <View style={{
    flex: 1,
    backgroundColor: 'white',

  }}>
          <Text style={{fontWeight: 'bold', color: 'black', fontSize: 25, marginVertical: 20, marginTop: 40, textAlign: 'left' }}>
          {"your favorite properties"}
          </Text>
    
    <FlatList
      data={data}
      
      renderItem={({ item }) => (
        <Animated.View>
          <PropertyCard item={item} />
        </Animated.View>
      )}
    />
    </View>
  );
}

