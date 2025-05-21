import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import * as Location from "expo-location";

interface MapProps {
  onLocationChange?: (latitude: number, longitude: number) => void;
  latitude?: number;
  longitude?: number;
}

export default function Map({ onLocationChange }: MapProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [coordinate, setCoordinate] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permissão de localização negada");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
    })();
  }, []);

  const handleLocationChange = (lat: number, lon: number) => {
    onLocationChange?.(lat, lon);
    setCoordinate({ latitude: lat, longitude: lon });
  };

  if (loading || !location) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        zoomEnabled={true}
        minZoomLevel={17}
        loadingEnabled={true}
        onLongPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          handleLocationChange(latitude, longitude);
        }}
      >
        {coordinate && (
          <Marker
            draggable
            coordinate={coordinate}
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              handleLocationChange(latitude, longitude);
            }}
            title="Ponto de encontro"
            description="Aqui é o ponto de encontro"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 230,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
