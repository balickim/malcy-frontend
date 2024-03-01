import React, {useEffect, useRef, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { add, locateOutline } from 'ionicons/icons';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import {socket} from "../socket";

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

const LocationMarker = ({ setFooEvents, onLocationUpdate }: { setFooEvents: (value: any) => void, onLocationUpdate: (latlng: L.LatLng) => void }) => {
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

      const nelat = bounds.getNorthEast().lat;
      const nelng = bounds.getNorthEast().lng;
      const swlat = bounds.getSouthWest().lat;
      const swlng = bounds.getSouthWest().lng;
      fetch(
        `${import.meta.env.VITE_API_URL}/settlement/bounds?southWestLat=${swlat}&southWestLng=${swlng}&northEastLat=${nelat}&northEastLng=${nelng}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        }
      ).then((res) => res.json()).then((data) => onFooEvent(data))
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
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const [values, setValues] = useState({name: '', lat: '', lng: ''})
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [playerLocation, setPlayerLocation] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map>(null);

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

  const settlementIcon = L.icon({
    iconUrl: 'assets/settlement_0.png',
    iconSize: [35, 35],
  });

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
        style={{ height: '100vh', width: '100%' }}
        maxBounds={cityBounds}
        maxBoundsViscosity={1}
      >
        <InvalidateSize />
        <LocationMarker
          setFooEvents={setFooEvents}
          onLocationUpdate={setPlayerLocation}
        />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup chunkedLoading>
          {fooEvents.length && fooEvents.map((markerPos, idx) => (
            <Marker key={idx} position={markerPos} icon={settlementIcon}>
              <Popup>
                <img src={'assets/settlement_0.png'} alt="settlement_0"/>
                <pre>{JSON.stringify(markerPos, null, 2)}</pre>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <IonButton
          shape={'round'}
          id="open-modal"
          expand="block"
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            zIndex: 1000,
          }}
        >
          <IonIcon aria-hidden="true" slot="start" ios={add} md={add} />
        </IonButton>
        <IonButton
          onClick={centerMapOnPlayer}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            zIndex: 1000,
            marginInline: 0
          }}
        >
          <IonIcon aria-hidden={'true'} slot={'start'} ios={locateOutline} md={locateOutline} />
        </IonButton>
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
