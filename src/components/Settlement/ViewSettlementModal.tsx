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

import { ISettlementDto, SettlementTypes } from "~/api/settlements/dtos";
import { Garrison } from "~/components/Settlement/Garrison";
import { Recruitments } from "~/components/Settlement/Recruitments";
import store from "~/store";

interface IViewSettlementModal {
  isOpen: boolean;
  closeModal: () => void;
  settlementData?: ISettlementDto;
}

export default function ViewSettlementModal({
  isOpen,
  closeModal,
  settlementData,
}: IViewSettlementModal) {
  const { userStore } = store;
  const settlementImage = {
    [SettlementTypes.MINING_TOWN]: "assets/settlements/types/mining_town.webp",
    [SettlementTypes.CASTLE_TOWN]: "assets/settlements/types/castle_town.webp",
    [SettlementTypes.FORTIFIED_SETTLEMENT]:
      "assets/settlements/types/fortified_settlement.webp",
    [SettlementTypes.CAPITOL_SETTLEMENT]:
      "assets/settlements/types/capitol_settlement.webp",
  };

  if (!settlementData) return null;
  return (
    <IonModal isOpen={isOpen} onWillDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => closeModal()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{settlementData?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex">
          <div className="inline-block w-full align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-2 sm:mt-0 sm:ml-4">
                <h4 className="text-lg leading-6 font-medium text-gray-900">
                  User Profile
                </h4>
                <p className="text-sm text-gray-500">
                  Nick: {settlementData.user.nick}
                </p>
                <p className="text-sm text-gray-500">
                  Email: {settlementData.user.email}
                </p>
                <p className="text-sm text-gray-500">
                  Created At: {settlementData.user.createdAt}
                </p>
              </div>

              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <img
                      src={settlementImage[settlementData.type]}
                      alt={settlementData.type}
                      className="max-h-40 mx-auto rounded-full"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {settlementData.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Type: {settlementData.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {userStore.user.id === settlementData.user.id ? (
          <>
            <Garrison settlementData={settlementData} />
            <Recruitments settlementData={settlementData} />
          </>
        ) : null}
      </IonContent>
    </IonModal>
  );
}
