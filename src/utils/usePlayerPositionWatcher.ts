import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { baseSocket } from "~/api/socket";
import store from "~/store";

export interface IGeoLocation {
  lat: number;
  lng: number;
}

export function usePlayerPositionWatcher() {
  const { userStore } = store;
  const [playerPosition, setPlayerPosition] = useState<IGeoLocation | null>(
    null,
  );

  useEffect(() => {
    let watchId: number | null = null;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          baseSocket.emit("playerPosition", {
            location,
            userId: userStore.user.id,
          });
          setPlayerPosition(location);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error("Access to location denied");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location unavailable");
              break;
            case error.TIMEOUT:
              toast.error("Location request timed out");
              break;
            default:
              toast.error("An unknown error occurred");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );

      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, []);

  return playerPosition;
}
