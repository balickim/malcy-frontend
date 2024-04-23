import L from "leaflet";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Circle, Marker } from "react-leaflet";

import { socket } from "~/api/socket";
import store from "~/store";

const walkingManIcon = L.icon({
  iconUrl: "assets/player.gif",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export function UserLocationMarker({
  location,
}: {
  location: {
    lat: number;
    lng: number;
  };
}) {
  const { serverConfigStore } = store;
  const [position, setPosition] = useState({
    lat: location.lat,
    lng: location.lng,
  });

  useEffect(() => {
    setPosition({
      lat: location.lat,
      lng: location.lng,
    });

    socket.on("location:error", (args) =>
      toast.error(args, { duration: 10000 }),
    );
    return () => {
      socket.off("location:error");
    };
  }, [location]);

  return position ? (
    <>
      <Marker position={position} icon={walkingManIcon} />
      <Circle
        center={position}
        radius={
          serverConfigStore.config?.DEFAULT_MAX_RADIUS_TO_TAKE_ACTION_METERS
        }
      />
    </>
  ) : null;
}
