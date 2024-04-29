import { IonSpinner } from "@ionic/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { IMessageDto } from "~/api/chat/dtos";
import ChatApi from "~/api/chat/routes";
import { authedChatSocket } from "~/api/socket";
import MessageInput from "~/components/Chat/MessageInput";
import MessageList from "~/components/Chat/MessageList";
import store from "~/store";

const Chat = () => {
  const { userStore } = store;
  const chatApi = new ChatApi();
  const [conversationId] = useState(1);

  const [messages, setMessages] = useState<IMessageDto[]>([]);

  const {
    data: messagesInConversation,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["getMessagesInConversation", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await chatApi.getMessagesInConversation(
        conversationId,
        pageParam,
      );
      return {
        pages: response.data.messages,
        nextPage: response.data.nextPage,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    const allFetchedMessages =
      messagesInConversation?.pages.flatMap((page) => page.pages) || [];
    setMessages((currentMessages) => {
      const newMessageSet = new Map(currentMessages.map((msg) => [msg, msg]));
      allFetchedMessages.forEach((msg) => newMessageSet.set(msg, msg));
      return Array.from(newMessageSet.values());
    });
  }, [messagesInConversation]);

  useEffect(() => {
    authedChatSocket.on("newMessage", (message: IMessageDto) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    return () => {
      authedChatSocket.off("newMessage");
    };
  }, []);

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
      <div
        id="scrollableDiv"
        style={{
          height: 300,
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <InfiniteScroll
          dataLength={messages.length || 0}
          style={{ display: "flex", flexDirection: "column-reverse" }}
          next={fetchNextPage}
          hasMore={hasNextPage ?? false}
          loader={<IonSpinner />}
          scrollableTarget="scrollableDiv"
          inverse
        >
          <MessageList messages={messages} />
        </InfiniteScroll>
      </div>

      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
