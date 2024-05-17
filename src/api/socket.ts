import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { tryRefreshToken } from "~/api/fetch";

const URL = import.meta.env.VITE_API_URL || "";

export const baseSocket = io(URL);

export const useWebSocket = <T>(
  namespace: string,
  events?: { [key: string]: (socket: Socket, data: any) => void },
): {
  socket: Socket | null;
  sendMessage: <T>(event: string, data: T) => void;
} => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageQueue, setMessageQueue] = useState<any[]>([]);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await tryRefreshToken();
      if (!token) {
        console.log("Authentication failure: No access token available.");
        return;
      }

      const sc = io(`${URL}/${namespace}`, { auth: { token } });

      sc.on("connect", () => {
        console.log(`Socket connected to namespace ${namespace}!`);
        messageQueue.forEach((msg) => sc.emit(msg.event, msg.data));
        setMessageQueue([]);
      });

      sc.on("connect_error", (err) => {
        console.log(`Connection error: ${err.message}`);
        sc.disconnect();
        setTimeout(connectSocket, 5000);
      });

      sc.on("disconnect", () => {
        connectSocket();
        console.log(`Socket disconnected from namespace ${namespace}!`);
      });

      events &&
        Object.keys(events).forEach((event) => {
          sc.on(event, (data) => events[event](sc, data));
        });

      setSocket(sc);
    };

    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, [namespace]);

  const sendMessage = useCallback(
    <T>(event: string, data: T) => {
      if (socket?.connected) {
        socket.emit(event, data);
      } else {
        setMessageQueue((prevQueue) => [...prevQueue, { event, data }]);
      }
    },
    [socket],
  );

  return {
    socket,
    sendMessage,
  };
};
