import L from "leaflet";
import React, { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import ChatWrapper from "~/components/Chat/ChatWrapper";
import ArmyWrapper from "~/components/Map/ArmyWrapper";
import Buttons from "~/components/Map/Buttons";
import InvalidateSize from "~/components/Map/InvalidateSize";
import { LocationFinderDummy } from "~/components/Map/LocationFinderDummy";
import { MapBoundsUpdater } from "~/components/Map/MapBoundsUpdater";
import { NoPlayerPositionInfo } from "~/components/Map/NoPlayerPositionInfo";
import { OtherPlayersLocationMarker } from "~/components/Map/OtherPlayersLocationsMarkers";
import ResourcesWrapper from "~/components/Map/ResourcesWrapper";
import { UserLocationMarker } from "~/components/Map/UserLocationMarker";
import PageContainer from "~/components/PageContainer";
import Settlements from "~/components/Settlements";
import AddSettlementModal from "~/components/Settlements/Modals/AddSettlementModal";
import { IBounds } from "~/types/settlement";
import { centerMapOnPlayer } from "~/utils/map";
import { useOthersPlayersPositionsWatcher } from "~/utils/useOtherPlayersPositionsWatcher";
import { usePlayerPositionWatcher } from "~/utils/usePlayerPositionWatcher";
import { useServerConfig } from "~/utils/useServerConfig";
import { useUser } from "~/utils/useUser";

const Map = () => {
  const playerLocation = usePlayerPositionWatcher();
  const otherPlayersPositions = useOthersPlayersPositionsWatcher();
  console.log(otherPlayersPositions);
  useUser({ refetchInterval: 5000 });
  const serverConfig = useServerConfig({
    refetchOnWindowFocus: false,
  });

  const mapRef = useRef<L.Map>(null);
  const cityBounds: L.LatLngBoundsExpression = [
    [53.391874, 14.424565], // south, west point
    [53.516425, 14.653759], // north, east point
  ];
  const [bounds, setBounds] = useState<IBounds>();
  const modalAddSettlementRef = useRef<HTMLIonModalElement>(null);

  if (!playerLocation || serverConfig.isFetching) {
    return (
      <PageContainer>
        <NoPlayerPositionInfo />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ChatWrapper />

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
        <ArmyWrapper />
        <ResourcesWrapper />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <UserLocationMarker location={playerLocation} />
        <OtherPlayersLocationMarker locations={otherPlayersPositions} />
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
