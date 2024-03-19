import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonLoading,
  useIonRouter,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { ILoginDto } from "~/api/auth/dtos";
import { logIn } from "~/api/auth/routes";
import PageContainer from "~/components/PageContainer";
import store from "~/store";

const Auth: React.FC = () => {
  const router = useIonRouter();
  const { userStore } = store;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (data: ILoginDto) => logIn(data),
  });

  const handleLogin = async () => {
    const res = await mutation.mutateAsync({ email, password });

    if (res) {
      console.log(res);
      userStore.logIn(res);
      router.push("/");
    }
  };

  const handleLogout = async () => {
    // const res = await mutation.mutateAsync({ email, password });
    //
    // if (res) {
    userStore.logOut();
    router.push("/login");
    // }
  };

  return (
    <PageContainer>
      <IonLoading isOpen={mutation.isPending} message="Loading..." />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Logowanie</IonTitle>
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

        <IonButton expand="block" onClick={handleLogout}>
          Wyloguj się
        </IonButton>
      </IonContent>
    </PageContainer>
  );
};

export default Auth;
