import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

import { SettlementDto } from "~/api/settlements/dtos";

interface IViewSettlementModal {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  settlementData?: SettlementDto;
}

export default function ViewSettlementModal({
  isOpen,
  setIsOpen,
  settlementData,
}: IViewSettlementModal) {
  return (
    <IonModal isOpen={isOpen} onWillDismiss={() => setIsOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{settlementData?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <img src={"assets/settlement_village.png"} alt="settlement_village" />
        <pre>{JSON.stringify(settlementData, null, 2)}</pre>
      </IonContent>
    </IonModal>
  );
}
