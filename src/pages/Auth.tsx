import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonLoading,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { ILoginDto } from "~/api/auth/dtos";
import { logIn } from "~/api/auth/routes";
import PageContainer from "~/components/PageContainer";
import store from "~/store";

export default observer(function Auth() {
  const { userStore } = store;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (data: ILoginDto) => logIn(data),
  });

  const handleLogin = async () => {
    const res = await mutation.mutateAsync({ email, password });

    if (res) {
      userStore.logIn(res);
      const event = new CustomEvent("login");
      window.dispatchEvent(event);
    }
  };

  return (
    <PageContainer>
      <IonLoading isOpen={mutation.isPending} message="Loading..." />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Logowanie/Rejestracja</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label={"Email"}
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label={"Hasło"}
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="block" onClick={handleLogin}>
          Zaloguj się
        </IonButton>
      </IonContent>
    </PageContainer>
  );
});
