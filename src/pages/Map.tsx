import L, { LatLngTuple } from "leaflet";
import React, { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import ChatWindowOnMap from "~/components/Chat/ChatWindowOnMap";
import ArmyInfoOnMap from "~/components/Map/ArmyInfoOnMap";
import Buttons from "~/components/Map/Buttons";
import FogOfWar from "~/components/Map/FogOfWar";
import { LocationFinderDummy } from "~/components/Map/LocationFinderDummy";
import { NoPlayerPositionInfo } from "~/components/Map/NoPlayerPositionInfo";
import { OtherPlayersLocationMarker } from "~/components/Map/OtherPlayersLocationsMarkers";
import ResourcesInfoOnMap from "~/components/Map/ResourcesInfoOnMap";
import { UserLocationMarker } from "~/components/Map/UserLocationMarker";
import PageContainer from "~/components/PageContainer";
import Settlements from "~/components/Settlements";
import AddSettlementModal from "~/components/Settlements/Modals/AddSettlementModal";
import { useOthersPlayersPositionsWatcher } from "~/utils/useOtherPlayersPositionsWatcher";
import { usePlayerPositionWatcher } from "~/utils/usePlayerPositionWatcher";
import { useServerConfig } from "~/utils/useServerConfig";
import { useUser } from "~/utils/useUser";

const Map = () => {
  const playerLocation = usePlayerPositionWatcher();
  const otherPlayersPositions = useOthersPlayersPositionsWatcher();
  const serverConfig = useServerConfig({ refetchOnWindowFocus: false });
  useUser({ refetchInterval: 5000 });

  const mapRef = useRef<L.Map>(null);
  const modalAddSettlementRef = useRef<HTMLIonModalElement>(null);

  const cityBounds: LatLngTuple[] = [
    [53.391874, 14.424565], // south-west
    [53.516425, 14.424565], // north-west
    [53.516425, 14.653759], // north-east
    [53.391874, 14.653759], // south-east
  ];

  if (!playerLocation || serverConfig.isFetching) {
    return (
      <PageContainer>
        <NoPlayerPositionInfo />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ArmyInfoOnMap />
      <ResourcesInfoOnMap />
      <ChatWindowOnMap />
      <Buttons mapRef={mapRef} playerLocation={playerLocation} />

      <AddSettlementModal modalRef={modalAddSettlementRef} />

      <MapContainer
        ref={mapRef}
        style={{ height: "calc(100vh - 57px)", width: "100%" }}
        center={[playerLocation.lat, playerLocation.lng]}
        zoom={18}
        minZoom={13}
        maxZoom={18}
        maxBounds={cityBounds}
        maxBoundsViscosity={1}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FogOfWar cityBounds={cityBounds} />

        <UserLocationMarker location={playerLocation} />
        <OtherPlayersLocationMarker locations={otherPlayersPositions} />
        <Settlements />

        {import.meta.env.DEV ? <LocationFinderDummy /> : null}
      </MapContainer>
    </PageContainer>
  );
};

export default Map;
