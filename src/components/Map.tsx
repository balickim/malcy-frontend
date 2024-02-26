import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon, IonInput, IonItem, IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, Marker, TileLayer, useMap} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import {
  add,
} from 'ionicons/icons';

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

const LocationMarker = ({ setFooEvents }: { setFooEvents: (value: any) => void }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({watch: false});

    const onLocationFound = (e: L.LocationEvent) => {
      map.flyTo(e.latlng, map.getZoom(), {animate: false});
      const radius = e.accuracy / 6;
      L.circle(e.latlng, radius).addTo(map);

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      fetch(
        `${import.meta.env.VITE_API_URL}/settlement/nearby?lat=${lat}&lng=${lng}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        }
      ).then((res) => res.json()).then((data) => setFooEvents(data))
    };

    map.on('locationfound', onLocationFound);

    return () => {
      map.stopLocate();
      map.off('locationfound', onLocationFound);
    };
  }, [map]);

  return null;
}

const Map = () => {
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const [values, setValues] = useState({name: '', lat: '', lng: ''})
  const modalRef = useRef<HTMLIonModalElement>(null);
  const defaultZoom = 17;

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
    [53.398309, 14.494537], // south, west point
    [53.483021, 14.604228] // north, east point
  ];

  return (
    <IonPage>
      <MapContainer
        id="map"
        center={[53.431018, 14.544677]}
        zoom={defaultZoom}
        style={{ height: '100vh', width: '100%' }}
        maxBounds={cityBounds}
        maxBoundsViscosity={1}
      >
        <InvalidateSize />
        <LocationMarker setFooEvents={setFooEvents} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {fooEvents.length && fooEvents.map((markerPos, idx) => (
          <Marker key={idx} position={markerPos} />
        ))}
        <IonButton
          shape={'round'}
          id="open-modal" expand="block"
          style={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            zIndex: 1000,
          }}
        >
          <IonIcon aria-hidden="true" slot="start" ios={add} md={add} />
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
