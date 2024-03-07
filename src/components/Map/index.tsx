import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import { socket } from "~/api/socket";
import { IBounds } from "~/types/settlement";
import PageContainer from "~/components/PageContainer";
import Settlements from "~/components/Map/Settlements";
import Buttons from "~/components/Map/Buttons";
import AppVersion from "~/components/Map/AppVersion";
import LocationMarker from "~/components/Map/LocationMarker";
import InvalidateSize from "~/components/Map/InvalidateSize";
import AddSettlementModal from "~/components/Map/AddSettlementModal";

const Map = () => {
  const initialBounds: IBounds = {
    northEastLat: 53.43246264935192,
    northEastLng: 14.54695522785187,
    southWestLat: 53.42957340431125,
    southWestLng: 14.542395472526552
  };

  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [playerLocation, setPlayerLocation] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [bounds, setBounds] = useState<IBounds>(initialBounds)

  async function confirm(values: any) {
    await fetch(
      `${import.meta.env.VITE_API_URL}/settlements`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      }
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

  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(e) {
        console.log(e.latlng);
      },
    });
    return null;
  };

  return (
    <PageContainer>
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

        <LocationFinderDummy />
        <AppVersion />
      </MapContainer>

      <AddSettlementModal modalRef={modalRef} />
    </PageContainer>
  );
};

export default Map;
