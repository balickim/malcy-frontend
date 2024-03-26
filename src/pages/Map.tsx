import L from "leaflet";
import React, { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import AddSettlementModal from "~/components/Map/AddSettlementModal";
import Buttons from "~/components/Map/Buttons";
import InvalidateSize from "~/components/Map/InvalidateSize";
import { LocationFinderDummy } from "~/components/Map/LocationFinderDummy";
import { MapBoundsUpdater } from "~/components/Map/MapBoundsUpdater";
import { NoPlayerPositionInfo } from "~/components/Map/NoPlayerPositionInfo";
import Settlements from "~/components/Map/Settlements";
import { UserLocationMarker } from "~/components/Map/UserLocationMarker";
import PageContainer from "~/components/PageContainer";
import { IBounds } from "~/types/settlement";
import { centerMapOnPlayer } from "~/utils/map";
import {
  IGeoLocation,
  useGeoLocationWatcher,
} from "~/utils/useGeoLocationWatcher";

const Map = () => {
  const mapRef = useRef<L.Map>(null);
  const cityBounds: L.LatLngBoundsExpression = [
    [53.391874, 14.424565], // south, west point
    [53.516425, 14.653759], // north, east point
  ];

  const [playerLocation, setPlayerLocation] = useState<IGeoLocation>();
  useGeoLocationWatcher({ setPlayerLocation });

  const [bounds, setBounds] = useState<IBounds>();
  const modalAddSettlementRef = useRef<HTMLIonModalElement>(null);
  return (
    <PageContainer>
      {playerLocation ? (
        <MapContainer
          ref={mapRef}
          id="map"
          center={[playerLocation.lat, playerLocation.lng]}
          zoom={18}
          minZoom={13}
          maxZoom={18}
          style={{ height: "calc(100vh - 57px)", width: "100%" }}
          maxBounds={cityBounds}
          maxBoundsViscosity={1}
        >
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
      ) : (
        <NoPlayerPositionInfo />
      )}
    </PageContainer>
  );
};

export default Map;
