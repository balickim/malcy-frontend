import React from "react";

import Chat from "~/components/Chat/index";

export default function ChatWrapper() {
  return (
    <div
      className={
        "absolute mb-[57px] bottom-0 z-[30000] bg-gray-800 bg-opacity-40"
      }
    >
      <Chat />
    </div>
  );
}
