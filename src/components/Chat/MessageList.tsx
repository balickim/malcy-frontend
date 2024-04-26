import dayjs from "dayjs";
import React from "react";

import { IChatMessageDto } from "~/api/chat/dtos";

interface IMessageList {
  messages: IChatMessageDto[];
}

const MessageList = ({ messages }: IMessageList) => {
  return (
    <div className="overflow-auto mb-4 min-w-xl max-w-xl">
      {messages.map((message, index) => (
        <div key={index} className="bg-white p-2 m-2 shadow text-black">
          <span className={"block text-wrap"}>{message.content}</span>
          <span className={"flex justify-end gap-1 text-gray-500 text-sm"}>
            <p>{message.user?.username}</p>
            <p>{dayjs(message.createdAt).format("DD/MM/YYYY HH:mm")}</p>
          </span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
