import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { IBounds } from "~/types/settlement";

interface IMapBoundsUpdaterProps {
  setBounds: (value: IBounds) => void;
}

export const MapBoundsUpdater: React.FC<IMapBoundsUpdaterProps> = ({
  setBounds,
}) => {
  const map = useMap();

  useEffect(() => {
    const onMapMove = () => {
      const bounds = map.getBounds();
      const northEastLat = bounds.getNorthEast().lat;
      const northEastLng = bounds.getNorthEast().lng;
      const southWestLat = bounds.getSouthWest().lat;
      const southWestLng = bounds.getSouthWest().lng;

      setBounds({ northEastLat, northEastLng, southWestLat, southWestLng });
    };

    onMapMove();
    map.on("moveend", onMapMove);
    return () => {
      map.off("moveend", onMapMove);
    };
  }, [map, setBounds]);

  return null;
};
