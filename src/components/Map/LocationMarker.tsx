import L from "leaflet";
import {useMap} from "react-leaflet";
import {useEffect} from "react";

interface ILocationMarker {
  setFooEvents: (value: any) => void,
  onLocationUpdate: (latlng: L.LatLng) => void,
  setBounds: (value: any) => void
}

export default function LocationMarker({ setFooEvents, onLocationUpdate, setBounds }: ILocationMarker) {
  const walkingManIcon = L.icon({
    iconUrl: 'assets/player.gif',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  const map = useMap();
  let marker: L.Marker | null = null;

  useEffect(() => {
    map.locate({ watch: true });

    const onLocationFound = (e: L.LocationEvent) => {
      const { latlng } = e;
      onLocationUpdate(latlng);

      if (!marker) {
        marker = L.marker(latlng, { icon: walkingManIcon }).addTo(map);
      } else {
        marker.setLatLng(latlng);
      }
    };

    function onFooEvent(value: any) {
      setFooEvents((previous: any) => {
        const newValues = Array.isArray(value) ? value : [value];
        const filteredNewValues = newValues.filter(nv => !previous.some((pv: any) => pv.id === nv.id));
        return [...previous, ...filteredNewValues];
      });
    }

    const onMapMove = () => {
      const bounds = map.getBounds();

      const northEastLat = bounds.getNorthEast().lat;
      const northEastLng = bounds.getNorthEast().lng;
      const southWestLat = bounds.getSouthWest().lat;
      const southWestLng = bounds.getSouthWest().lng;

      setBounds({ northEastLat, northEastLng, southWestLat, southWestLng })
    };

    map.on('locationfound', onLocationFound);
    map.on('moveend', onMapMove);
    return () => {
      map.stopLocate();
      map.off('locationfound', onLocationFound);
      map.off('moveend', onMapMove);
    };

  }, [map]);

  return null;
}