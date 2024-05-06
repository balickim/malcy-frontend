import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { tryRefreshToken } from "~/api/fetch";

const URL = import.meta.env.VITE_API_URL || "";

export const baseSocket = io(URL);

export interface ISendMessageData {
  userId: string;
  content: string;
  conversationId: number;
}

export const useChatSocket = () => {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [messageQueue, setMessageQueue] = useState<ISendMessageData[]>([]);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await tryRefreshToken();
      if (!token) {
        console.log("Authentication failure: No access token available.");
        return;
      }

      const sc = io(URL + "/chat", { auth: { token } });

      sc.on("connect", () => {
        console.log("Socket connected!");
        messageQueue.forEach((msg) => sc.emit("sendMessage", msg));
        setMessageQueue([]);
      });

      sc.on("connect_error", (err) => {
        console.log(`Connection error: ${err.message}`);
        sc.disconnect();
        setTimeout(() => {
          connectSocket();
        }, 5000);
      });

      sc.on("disconnect", () => {
        connectSocket();
        console.log("Socket disconnected!");
      });

      setChatSocket(sc);
    };

    connectSocket();

    return () => {
      chatSocket?.disconnect();
    };
  }, []);

  const sendMessage = useCallback(
    (data: ISendMessageData) => {
      if (chatSocket?.connected) {
        chatSocket.emit("sendMessage", data);
      } else {
        setMessageQueue((prevQueue) => [...prevQueue, data]);
      }
    },
    [chatSocket],
  );

  return {
    chatSocket,
    sendMessage,
  };
};
