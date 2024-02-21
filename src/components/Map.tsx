import {IonPage} from "@ionic/react";
import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const InvalidateSize: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};

const Map: React.FC = () => {
  const [mapKey, setMapKey] = useState<number>(Date.now());

  useEffect(() => {
    setMapKey(Date.now())
  }, []);
  return (
    <IonPage>
        <MapContainer
          key={mapKey}
          id="map"
          center={[53.431018, 14.544677]}
          zoom={24}
          style={{ height: '100vh', width: '100%' }}
        >
          <InvalidateSize />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
    </IonPage>
  );
};

export default Map;
