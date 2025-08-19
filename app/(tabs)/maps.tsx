import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import useGetData from "@/app/users/get";
import { Property, User } from "@/constants/types";
import Ip from "../id";
import { Propertyfav } from '../../components/context/propertyfav';
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function MapScreen() {
  const data: User[] = useGetData("users", "user");
  const ip = Ip();

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://${ip}:3000/api/v1/properties?limit=100`);
      if (!response.ok) throw new Error("Network response was not ok");
      const json = await response.json();
      setProperties(json.items);
    } catch (err) {
      console.error("Erreur fetch propriété:", err);
      setError("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  }, [ip]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'propertyClick') {
        const selected = properties.find(p => p.id === message.propertyId);
        setSelectedProperty(selected||null);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }, [properties]);

  if (!data || data.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>no user found</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchProperties}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { latitude: lat, longitude: lng } = data[0].address;

  const generatePropertyMarkers = () => {
    return properties
      .map((p) => `
        var marker = L.marker([${p.coordinates.latitude}, ${p.coordinates.longitude}], { icon: propertyIcon })
          .addTo(map)
          .bindPopup("<b>${p.title || "Propriété"}</b><br>");

        marker.on("click", function() {
          map.flyTo([${p.coordinates.latitude}, ${p.coordinates.longitude}], 17, { duration: 1.5 });
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'propertyClick',
            propertyId: '${p.id}'
          }));
        });
      `)
      .join("\n");
  };

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${lat}, ${lng}], 13);
       
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap France | © contributeurs OSM',
          maxZoom: 19
        }).addTo(map);

        var userIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          iconSize: [32, 32],
        });
        
        var propertyIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/235/235861.png',
          iconSize: [32, 32],
        });
       
        var userMarker = L.marker([${lat}, ${lng}], { icon: userIcon })
          .addTo(map)
          .bindPopup("your position")
          .openPopup();
        
        ${generatePropertyMarkers()}

        // Zoom automatique sur la position utilisateur au démarrage
        map.flyTo([${lat}, ${lng}], 14, { duration: 2 });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: leafletHTML }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        injectedJavaScript={`
          window.postMessage = function(data) {
            window.ReactNativeWebView.postMessage(data);
          };
          true;
        `}
      />
      
      {selectedProperty && (
        <View style={styles.cardContainer}>
       
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedProperty(null)}
          >
            <AntDesign name="closecircle" size={24} color="#333" />
          </TouchableOpacity>
          
         
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({
              pathname: "/property/[id]",
              params: { id: selectedProperty.id }
            })}
          >
            <Propertyfav item={selectedProperty} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: 'relative'
  },
  webview: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: 'blue',
    marginTop: 10,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
   width: 250,
    
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1001,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});