import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function InvalidateSize() {
  const map = useMap();

  // Reset map after 200 ms to fix it
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
}
