import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { RefObject, useState } from "react";

import { fetchWrapper } from "~/api/fetch";

interface IAddSettlementModal {
  modalRef: RefObject<HTMLIonModalElement>;
}

export default function AddSettlementModal({ modalRef }: IAddSettlementModal) {
  const [values, setValues] = useState({ name: "", lat: "", lng: "" });

  async function confirm() {
    await fetchWrapper(`${import.meta.env.VITE_API_URL}/settlements`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    modalRef.current?.dismiss();
  }

  return (
    <IonModal ref={modalRef} trigger="open-modal">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => modalRef.current?.dismiss()}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Welcome</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => confirm()}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="Name"
              value={values.name}
              onIonChange={(event) =>
                // @ts-expect-error blah blah blah
                setValues((prevState) => ({
                  ...prevState,
                  name: event.detail.value,
                }))
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Lat"
              value={values.lat}
              onIonChange={(event) =>
                // @ts-expect-error blah blah blah
                setValues((prevState) => ({
                  ...prevState,
                  lat: event.detail.value,
                }))
              }
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Lng"
              value={values.lng}
              onIonChange={(event) =>
                // @ts-expect-error blah blah blah
                setValues((prevState) => ({
                  ...prevState,
                  lng: event.detail.value,
                }))
              }
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
}
