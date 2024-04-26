import { io, ManagerOptions, SocketOptions } from "socket.io-client";

import { getAccessToken } from "~/utils/cookies";

const URL = import.meta.env.VITE_API_URL || "";
const token = getAccessToken();

export const socket = io(URL);
const chatSocket = (options: Partial<ManagerOptions & SocketOptions>) =>
  io(URL + "/chat", options);

export const authedChatSocket = chatSocket({ auth: { token } });
