import { useEffect } from "react";
import { toast } from "react-hot-toast";

import { socket } from "~/api/socket";
import store from "~/store";

export interface IGeoLocation {
  lat: number;
  lng: number;
}

interface IUseGeoLocationWatcherProps {
  setPlayerLocation: (location: IGeoLocation) => void;
}

export function useGeoLocationWatcher({
  setPlayerLocation,
}: IUseGeoLocationWatcherProps): void {
  const { userStore } = store;
  useEffect(() => {
    let watchId: number | null = null;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          socket.emit("position", {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            userId: userStore.user.id,
          });

          setPlayerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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
  }, [setPlayerLocation]);
}
