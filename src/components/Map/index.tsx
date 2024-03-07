import React, {useEffect, useRef, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import { socket } from "../../api/socket";
import Settlements from "./Settlements";
import { IBounds } from "../../types/settlement";
import Buttons from "./Buttons";

const InvalidateSize: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
};

const walkingManIcon = L.icon({
  iconUrl: 'assets/player.gif',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocationMarker = ({ setFooEvents, onLocationUpdate, setBounds }: { setFooEvents: (value: any) => void, onLocationUpdate: (latlng: L.LatLng) => void, setBounds: (value: any) => void }) => {
  const map = useMap();
  let marker: L.Marker | null = null;

  useEffect(() => {
    map.locate({ watch: true });

    const onLocationFound = (e: L.LocationEvent) => {
      const { latlng } = e;
      onLocationUpdate(latlng);

      if (!marker) {
        marker = L.marker(latlng, { icon: walkingManIcon }).addTo(map);
      } else {
        marker.setLatLng(latlng);
      }
    };

    function onFooEvent(value: any) {
      setFooEvents((previous: any) => {
        const newValues = Array.isArray(value) ? value : [value];
        const filteredNewValues = newValues.filter(nv => !previous.some((pv: any) => pv.id === nv.id));
        return [...previous, ...filteredNewValues];
      });
    }

    const onMapMove = () => {
      const bounds = map.getBounds();

      const northEastLat = bounds.getNorthEast().lat;
      const northEastLng = bounds.getNorthEast().lng;
      const southWestLat = bounds.getSouthWest().lat;
      const southWestLng = bounds.getSouthWest().lng;

      setBounds({ northEastLat, northEastLng, southWestLat, southWestLng })
    };

    map.on('locationfound', onLocationFound);
    map.on('moveend', onMapMove);
    return () => {
      map.stopLocate();
      map.off('locationfound', onLocationFound);
      map.off('moveend', onMapMove);
    };

  }, [map]);

  return null;
}

const Map = () => {
  const initialBounds: IBounds = {northEastLat: 53.43246264935192, northEastLng: 14.54695522785187, southWestLat: 53.42957340431125, southWestLng: 14.542395472526552}

  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const [values, setValues] = useState({name: '', lat: '', lng: ''})
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [playerLocation, setPlayerLocation] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [bounds, setBounds] = useState<IBounds>(initialBounds)

  async function confirm() {
    await fetch(
      `${import.meta.env.VITE_API_URL}/settlement`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: values.name, lat: values.lat, lng: values.lng })}
    )

    modalRef.current?.dismiss();
  }

  useEffect(() => {
    function onFooEvent(value: any) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('foo', onFooEvent);

    return () => {
      socket.off('foo', onFooEvent);
    };
  }, []);

  const cityBounds: L.LatLngBoundsExpression = [
    [53.391874, 14.424565], // south, west point
    [53.516425, 14.653759] // north, east point
  ];

  const centerMapOnPlayer = () => {
    if (mapRef.current && playerLocation) {
      mapRef.current.flyTo(playerLocation, mapRef.current.getZoom(), {animate: true});
    }
  };

  return (
    <IonPage>
      <MapContainer
        ref={mapRef}
        id="map"
        center={[53.431018, 14.544677]}
        zoom={18}
        minZoom={13}
        maxZoom={18}
        style={{ height: '100vh', width: '100%' }}
        maxBounds={cityBounds}
        maxBoundsViscosity={1}
      >
        <InvalidateSize />
        <LocationMarker
          setFooEvents={setFooEvents}
          onLocationUpdate={setPlayerLocation}
          setBounds={setBounds}
        />
        <Settlements bounds={bounds} />
        <Buttons centerMapOnPlayer={centerMapOnPlayer} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>

      <IonModal ref={modalRef} trigger="open-modal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modalRef.current?.dismiss()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Welcome</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonInput
                label="Name"
                value={values.name}
                // @ts-ignore
                onIonChange={(event) => setValues(prevState => ({...prevState, name: event.detail.value}))}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Lat"
                value={values.lat}
                // @ts-ignore
                onIonChange={(event) => setValues(prevState => ({...prevState, lat: event.detail.value}))}
              />
            </IonItem>

            <IonItem>
              <IonInput
                label="Lng"
                value={values.lng}
                // @ts-ignore
                onIonChange={(event) => setValues(prevState => ({...prevState, lng: event.detail.value}))}
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Map;
