import { LatLngTuple } from "leaflet";
import React, { useEffect, useState } from "react";
import { Pane, Polygon } from "react-leaflet";

import { baseSocket } from "~/api/socket";

interface IFogOfWar {
  cityBounds: LatLngTuple[];
}

const FogOfWar = ({ cityBounds }: IFogOfWar) => {
  const [discoveredAreas, setDiscoveredAreas] = useState([]);
  const [visibleAreas, setVisibleAreas] = useState([]);
  useEffect(() => {
    baseSocket.on("allDiscoveredByUser", (args) => setDiscoveredAreas(args));
    baseSocket.on("allVisibleByUser", (args) => setVisibleAreas(args));
    return () => {
      baseSocket.off("allDiscoveredByUser");
      baseSocket.off("allVisibleByUser");
    };
  }, []);

  return (
    <>
      <Pane name={"discoveredArea"}>
        <Polygon
          positions={[cityBounds, discoveredAreas.map((area) => area)]}
          color="black"
          fillOpacity={0.2}
          weight={0}
        />
      </Pane>
      <Pane name={"visibleArea"}>
        <Polygon
          positions={[cityBounds, visibleAreas.map((area) => area)]}
          color="black"
          fillOpacity={0.5}
          weight={0}
        />
      </Pane>
    </>
  );
};

export default FogOfWar;
