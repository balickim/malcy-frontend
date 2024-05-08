import { IonButton, IonIcon } from "@ionic/react";
import { add, locateOutline } from "ionicons/icons";
import React from "react";

import { centerMapOnPlayer } from "~/utils/map";
import { IGeoLocation } from "~/utils/usePlayerPositionWatcher";

interface IButtons {
  playerLocation: IGeoLocation;
  mapRef: React.RefObject<L.Map>;
}

export default function Buttons({ mapRef, playerLocation }: IButtons) {
  return (
    <>
      <IonButton
        id="open-modal"
        className={"absolute bottom-32 right-2 z-[1500] min-h-8 min-w-16"}
      >
        <IonIcon aria-hidden="true" ios={add} md={add} />
      </IonButton>

      <IonButton
        onClick={() => centerMapOnPlayer(mapRef, playerLocation)}
        className={"absolute bottom-20 right-2 z-[1500] min-h-8 min-w-16"}
      >
        <IonIcon aria-hidden={"true"} ios={locateOutline} md={locateOutline} />
      </IonButton>
    </>
  );
}
