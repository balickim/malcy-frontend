import L from "leaflet";
import React, { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Buttons from "~/components/Map/Buttons";
import InvalidateSize from "~/components/Map/InvalidateSize";
import { LocationFinderDummy } from "~/components/Map/LocationFinderDummy";
import { MapBoundsUpdater } from "~/components/Map/MapBoundsUpdater";
import { NoPlayerPositionInfo } from "~/components/Map/NoPlayerPositionInfo";
import { UserLocationMarker } from "~/components/Map/UserLocationMarker";
import PageContainer from "~/components/PageContainer";
import AddSettlementModal from "~/components/Settlement/AddSettlementModal";
import Settlements from "~/components/Settlement/Settlements";
import { IBounds } from "~/types/settlement";
import { centerMapOnPlayer } from "~/utils/map";
import { usePlayerLocationWatcher } from "~/utils/usePlayerLocationWatcher";

const Map = () => {
  const playerLocation = usePlayerLocationWatcher();
  const mapRef = useRef<L.Map>(null);
  const cityBounds: L.LatLngBoundsExpression = [
    [53.391874, 14.424565], // south, west point
    [53.516425, 14.653759], // north, east point
  ];
  const [bounds, setBounds] = useState<IBounds>();
  const modalAddSettlementRef = useRef<HTMLIonModalElement>(null);

  if (!playerLocation) {
    return (
      <PageContainer>
        <NoPlayerPositionInfo />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MapContainer
        ref={mapRef}
        id="map"
        center={[playerLocation.lat, playerLocation.lng]}
        minZoom={13}
        maxZoom={18}
        style={{ height: "calc(100vh - 57px)", width: "100%" }}
        maxBounds={cityBounds}
        maxBoundsViscosity={1}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <UserLocationMarker location={playerLocation} />
        <MapBoundsUpdater setBounds={setBounds} />
        <Settlements bounds={bounds} />
        <Buttons
          centerMapOnPlayer={() => centerMapOnPlayer(mapRef, playerLocation)}
        />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <AddSettlementModal modalRef={modalAddSettlementRef} />

        <InvalidateSize />
        <LocationFinderDummy />
      </MapContainer>
    </PageContainer>
  );
};

export default Map;
