import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { UseFormSetValue } from "react-hook-form";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Props = {
  setValue: UseFormSetValue<any>;
};

function ClickHandler({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function Mapa({ setValue }: Props) {
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  const handleMapClick = (latlng: L.LatLng) => {
    setMarkerPosition(latlng);
    setValue("latitude", latlng.lat);
    setValue("longitude", latlng.lng);
  };

  return (
    <MapContainer
      center={[-23.9633, -46.3919]}
      zoom={13}
      style={{ height: "20rem", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Escutando clique no mapa */}
      <ClickHandler onClick={handleMapClick} />

      {/* Mostrar marcador quando o usuário clicar */}
      {markerPosition && (
        <Marker position={markerPosition}>
          <Popup>
            Coordenadas:
            <br />
            Lat: {markerPosition.lat.toFixed(5)}
            <br />
            Lng: {markerPosition.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
