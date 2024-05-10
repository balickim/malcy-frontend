import { useQuery } from "@tanstack/react-query";
import { LatLngTuple } from "leaflet";
import React from "react";
import { Pane, Polygon } from "react-leaflet";

import FogOfWarApi from "~/api/fog-of-war/routes";

interface IFogOfWar {
  cityBounds: LatLngTuple[];
}

const FogOfWar = ({ cityBounds }: IFogOfWar) => {
  const fogOfWarApi = new FogOfWarApi();
  const {
    data: usersDiscoveredAreas,
    isSuccess: usersDiscoveredAreasIsSuccess,
  } = useQuery({
    queryKey: ["getUsersDiscoveredAreas"],
    queryFn: () => fogOfWarApi.getUsersDiscoveredAreas(),
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
  });
  const { data: usersVisibleAreas, isSuccess: usersVisibleAreasIsSuccess } =
    useQuery({
      queryKey: ["getUsersVisibleAreas"],
      queryFn: () => fogOfWarApi.getUsersVisibleAreas(),
      refetchOnWindowFocus: false,
      refetchInterval: 5000,
    });

  return (
    <>
      <Pane name={"discoveredArea"}>
        {usersDiscoveredAreasIsSuccess ? (
          <>
            <Polygon
              positions={[
                cityBounds,
                usersDiscoveredAreas?.data.map((area) => area),
              ]}
              color="black"
              fillOpacity={0.2}
              weight={0}
            />
          </>
        ) : null}
      </Pane>
      <Pane name={"visibleArea"}>
        {usersVisibleAreasIsSuccess ? (
          <>
            <Polygon
              positions={[
                cityBounds,
                usersVisibleAreas?.data.map((area) => area),
              ]}
              color="black"
              fillOpacity={0.5}
              weight={0}
            />
          </>
        ) : null}
      </Pane>
    </>
  );
};

export default FogOfWar;
