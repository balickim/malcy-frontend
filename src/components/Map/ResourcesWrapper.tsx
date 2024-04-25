import { observer } from "mobx-react-lite";
import React from "react";

import { Resources } from "~/components/Resources";
import store from "~/store";

export default observer(function ResourcesWrapper() {
  const { userStore } = store;

  return (
    <div
      className={
        "absolute top-0 right-1/2 z-[1000] bg-gray-800 bg-opacity-40 p-2 rounded-bl text-white"
      }
    >
      <Resources gold={userStore.user.gold} wood={userStore.user.wood} />
    </div>
  );
});
