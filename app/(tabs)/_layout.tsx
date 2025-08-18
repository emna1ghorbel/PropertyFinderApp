import { Tabs } from "expo-router";
import { Button, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { AntDesign } from "@expo/vector-icons";
import { Search,Map } from 'lucide-react-native';

export default function AppLayout() {
  
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="homescreen"
        options={{
          title: "Accueil", 
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={24} color='black'  />
          ),
        }}
      />
      <Tabs.Screen
        name="recherche"
        options={{
          title: "recherche",
          tabBarIcon: ({ color, size }) => (
                <Search />
          ),
        }}
      />
     
      
      <Tabs.Screen
        name="fav"
        options={{
          title: "favv",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "mapss",
          tabBarIcon: ({ color, size }) => (
             <Map />
          ),
        }}
      />
        <Tabs.Screen
        name="User_profile"
        options={{
          title: "User_profile",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={24} color="black" />
          ),
        }}
      />
      
       <Tabs.Screen 
        name="+not-found"
        options={{href: null,//
          title: "not found ",
          tabBarIcon: ({ color, size }) => (
           <Entypo name="log-out" size={24} color="black" />
          ),
          
        }}
      />
       <Tabs.Screen
        name="explore"
        options={{href: null,
          title: "Explorer",
           tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="travel-explore" size={24} color="black" />
          ),
        }}
      />
       <Tabs.Screen
        name="appstore"
        options={{href: null,
          title: "appstore",
           tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="travel-explore" size={24} color="black" />
          ),
        }}
      />
      

    </Tabs>
  );
}
