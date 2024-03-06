import {IonButton, IonIcon} from "@ionic/react";
import {add, locateOutline} from "ionicons/icons";
import React from "react";

interface IButtons {
  centerMapOnPlayer: () => void
}

export default function Buttons({ centerMapOnPlayer }: IButtons) {
  return (
    <>
      <IonButton
        shape={'round'}
        id="open-modal"
        expand="block"
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          zIndex: 1000,
        }}
      >
        <IonIcon aria-hidden="true" slot="start" ios={add} md={add} />
      </IonButton>
      <IonButton
        onClick={centerMapOnPlayer}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          zIndex: 1000,
        }}
      >
        <IonIcon aria-hidden={'true'} slot={'start'} ios={locateOutline} md={locateOutline} />
      </IonButton>
    </>
  )
}