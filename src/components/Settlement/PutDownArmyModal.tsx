import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { putDownArmy } from "~/api/settlements/routes";

interface IViewSettlementModal {
  isOpen: boolean;
  closeModal: () => void;
  settlementId?: string;
}

export default function PutDownArmyModal({
  isOpen,
  closeModal,
  settlementId,
}: IViewSettlementModal) {
  const putDownArmyMutation = useMutation({
    mutationFn: putDownArmy,
  });
  const [unitCount, setUnitCount] = useState(10);

  const handlePickUpArmy = async () => {
    await putDownArmyMutation.mutateAsync({
      knights: unitCount,
      archers: 0,
      settlementId,
    });
  };

  return (
    <IonModal isOpen={isOpen} onWillDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => closeModal()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Upuść żołnierzy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex">
          <div className="inline-block w-full align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div>
                <input
                  type="number"
                  value={unitCount}
                  onChange={(e) =>
                    setUnitCount(e.target.value as unknown as number)
                  }
                />
                <button onClick={() => handlePickUpArmy()}>Upuść</button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
