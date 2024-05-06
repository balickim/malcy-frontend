import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { getAccessToken } from "~/utils/cookies";

const URL = import.meta.env.VITE_API_URL || "";

export const baseSocket = io(URL);

export const useChatSocket = () => {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const sc = io(URL + "/chat", {
      auth: { token },
    });

    setChatSocket(sc);

    return () => {
      sc.disconnect();
    };
  }, []);

  return chatSocket;
};
