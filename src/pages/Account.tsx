import { IonHeader, IonToolbar, IonTitle, IonButton } from "@ionic/react";
import React from "react";

import PageContainer from "~/components/PageContainer";
import store from "~/store";

const Auth: React.FC = () => {
  const { userStore } = store;

  const handleLogout = async () => {
    userStore.logOut();
    const event = new CustomEvent("unauthorized");
    window.dispatchEvent(event);
  };

  return (
    <PageContainer>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Konto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonButton expand="block" onClick={handleLogout}>
        Wyloguj się
      </IonButton>
    </PageContainer>
  );
};

export default Auth;
