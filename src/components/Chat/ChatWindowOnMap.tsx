import React from "react";

import Chat from "~/components/Chat/index";

export default function ChatWindowOnMap() {
  return (
    <div
      className={
        "absolute z-[1500] mb-[57px] bottom-0 bg-gray-800 bg-opacity-40"
      }
    >
      <Chat />
    </div>
  );
}
