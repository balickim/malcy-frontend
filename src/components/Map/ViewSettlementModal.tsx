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

import { ISettlementDto, SettlementType } from "~/api/settlements/dtos";

interface IViewSettlementModal {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  settlementData?: ISettlementDto;
}

export default function ViewSettlementModal({
  isOpen,
  setIsOpen,
  settlementData,
}: IViewSettlementModal) {
  const settlementImage = {
    [SettlementType.village]: "assets/settlement_village.png",
    [SettlementType.town]: "assets/settlement_town.png",
    [SettlementType.city]: "assets/settlement_city.png",
  };

  if (!settlementData) return null;
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
                      className="max-h-40 mx-auto"
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
      </IonContent>
    </IonModal>
  );
}
