import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

import { IChatMessageDto } from "~/api/chat/dtos";
import ChatApi from "~/api/chat/routes";
import { authedChatSocket } from "~/api/socket";
import MessageInput from "~/components/Chat/MessageInput";
import MessageList from "~/components/Chat/MessageList";
import store from "~/store";

const Chat = () => {
  const { userStore } = store;
  const chatApi = new ChatApi();

  const [messages, setMessages] = useState<IChatMessageDto[]>([]);
  const [conversationId] = useState(1);
  const [page] = useState(1);

  const { data: messagesInConversation, isSuccess } = useQuery({
    queryKey: ["getMessagesInConversation", conversationId, page],
    queryFn: () => chatApi.getMessagesInConversation(conversationId, page),
    enabled: conversationId !== undefined && page !== undefined,
  });

  useEffect(() => {
    authedChatSocket.on("newMessage", (message: IChatMessageDto) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      authedChatSocket.off("newMessage");
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setMessages((previous) => {
        const newMessages = Array.isArray(messagesInConversation?.data)
          ? messagesInConversation?.data
          : [messagesInConversation?.data].filter((x) => x);
        const updatedMessages = new Map(previous.map((m) => [m, m]));

        newMessages.forEach((nm) => {
          updatedMessages.set(nm, nm);
        });

        return Array.from(updatedMessages.values());
      });
    }
  }, [isSuccess, messagesInConversation?.data]);

  const sendMessage = (content: string) => {
    const data = {
      userId: userStore.user.id,
      content,
      conversationId,
    };
    authedChatSocket.emit("sendMessage", data);
  };

  return (
    <div className={"flex flex-col h-full justify-between"}>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
