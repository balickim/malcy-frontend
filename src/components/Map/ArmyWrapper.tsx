import { observer } from "mobx-react-lite";
import React from "react";

import { Army } from "~/components/Army";
import store from "~/store";

export default observer(function ArmyWrapper() {
  const { userStore } = store;

  return (
    <div
      className={
        "absolute top-0 right-0 z-[1000] bg-gray-800 bg-opacity-40 p-2 rounded-bl text-white"
      }
    >
      <Army army={userStore.user.army} />
    </div>
  );
});
