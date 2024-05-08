import L, { LatLngTuple, LatLngBoundsExpression } from "leaflet";
import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import ChatWindowOnMap from "~/components/Chat/ChatWindowOnMap";
import ArmyInfoOnMap from "~/components/Map/ArmyInfoOnMap";
import Buttons from "~/components/Map/Buttons";
import { LocationFinderDummy } from "~/components/Map/LocationFinderDummy";
import { MapBoundsUpdater } from "~/components/Map/MapBoundsUpdater";
import { NoPlayerPositionInfo } from "~/components/Map/NoPlayerPositionInfo";
import { OtherPlayersLocationMarker } from "~/components/Map/OtherPlayersLocationsMarkers";
import ResourcesInfoOnMap from "~/components/Map/ResourcesInfoOnMap";
import { UserLocationMarker } from "~/components/Map/UserLocationMarker";
import PageContainer from "~/components/PageContainer";
import Settlements from "~/components/Settlements";
import AddSettlementModal from "~/components/Settlements/Modals/AddSettlementModal";
import { IBounds } from "~/types/settlement";
import { useOthersPlayersPositionsWatcher } from "~/utils/useOtherPlayersPositionsWatcher";
import { usePlayerPositionWatcher } from "~/utils/usePlayerPositionWatcher";
import { useServerConfig } from "~/utils/useServerConfig";

const Map = () => {
  const playerLocation = usePlayerPositionWatcher();
  const otherPlayersPositions = useOthersPlayersPositionsWatcher();
  const serverConfig = useServerConfig({ refetchOnWindowFocus: false });

  const mapRef = useRef<L.Map>(null);
  const [bounds, setBounds] = useState<IBounds>();
  const modalAddSettlementRef = useRef<HTMLIonModalElement>(null);

  const cityBounds: LatLngBoundsExpression = [
    [53.391874, 14.424565], // south-west
    [53.516425, 14.424565], // north-west
    [53.516425, 14.653759], // north-east
    [53.391874, 14.653759], // south-east
  ];
  const uncoveredArea: LatLngTuple[] = [
    [53.45, 14.5],
    [53.47, 14.52],
    [53.46, 14.55],
    [53.44, 14.53],
  ];
  const fogOfWarCoordinates: LatLngTuple[][] = [cityBounds, uncoveredArea];

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

        <Polygon
          positions={fogOfWarCoordinates}
          color="gray"
          fillOpacity={0.4}
        />

        <UserLocationMarker location={playerLocation} />
        <OtherPlayersLocationMarker locations={otherPlayersPositions} />
        <MapBoundsUpdater setBounds={setBounds} />
        {/*<Settlements bounds={bounds} />*/}

        {import.meta.env.DEV ? <LocationFinderDummy /> : null}
      </MapContainer>
    </PageContainer>
  );
};

export default Map;
