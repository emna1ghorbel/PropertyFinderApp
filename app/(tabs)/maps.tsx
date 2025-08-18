import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import useGetData from "@/app/users/get";
import { Property, User } from "@/constants/types";
import Ip from "../id";
import { PropertyCard,} from '../../components/context/propertycard'
export default function App() {
  const data: User[] = useGetData("users", "user");
  const ip = Ip();

  const [property, setProperty] = useState<Property[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`http://${ip}:3000/api/v1/properties?limit=100
`);
        const json = await response.json();
        setProperty(json.items);
      } catch (e) {
        console.error("Erreur fetch propriété:", e);
      }
    }
    fetchPosts();
  }, []);

  if (!data || data.length === 0) {
    return (
      <View>
        <Text>Aucune donnée utilisateur</Text>
      </View>
    );
  }


  const lat = data[0].address.latitude;
  const lng = data[0].address.longitude;


  const propertymark = property
    .map(
      (p) => `
        var marker = L.marker([${p.coordinates.latitude}, ${p.coordinates.longitude}], { icon: propertyIcon })
          .addTo(map)
          .bindPopup("<b>${p.title || "Propriété"}</b><br>${p.description || ""}");

        marker.on("click", function() {
          map.flyTo([${p.coordinates.latitude}, ${p.coordinates.longitude}], 17, { duration: 1.5 });
        });
      `
    )
    .join("\n");

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <style>
        html, body, #map {
          height: 100%;
          margin: 0;
          padding: 0;
        }
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
          .bindPopup("Vous êtes ici")
          .openPopup();

        
        ${propertymark}

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
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
