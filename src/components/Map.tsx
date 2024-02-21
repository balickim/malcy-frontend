import {IonPage} from "@ionic/react";
import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import {Geolocation, Position} from '@capacitor/geolocation';

import 'leaflet/dist/leaflet.css';
import L, {LatLng} from "leaflet";

const InvalidateSize: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
};

const LocationMarker = () => {
  const map = useMap();

  useEffect(() => {
    map.locate({watch: true});

    const onLocationFound = (e: L.LocationEvent) => {
      map.flyTo(e.latlng, map.getZoom(), {animate: false});
      const radius = e.accuracy / 6;
      L.circle(e.latlng, radius).addTo(map);
    };

    map.on('locationfound', onLocationFound);

    return () => {
      map.stopLocate();
      map.off('locationfound', onLocationFound);
    };
  }, [map]);

  return null;
}

const Map: React.FC = () => {
  const fixedZoom = 17;
  const [markers, setMarkers] = useState<L.LatLng[]>([]);

  const addMarker = (latlng: L.LatLng) => {
    setMarkers([...markers, latlng]);
  };

  return (
    <IonPage>
      <MapContainer
        id="map"
        center={[53.431018, 14.544677]}
        zoom={fixedZoom}
        style={{ height: '100vh', width: '100%' }}
      >
        <InvalidateSize />
        <LocationMarker />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((markerPos, idx) => (
          <Marker key={idx} position={markerPos} />
        ))}
        <button
          onClick={() => Geolocation.getCurrentPosition().then((position) => {
            addMarker(new L.LatLng(position.coords.latitude, position.coords.longitude));
          })}
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          +
        </button>
      </MapContainer>
    </IonPage>
  );
};

export default Map;
