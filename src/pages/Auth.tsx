import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonLoading,
  useIonRouter
} from '@ionic/react';
import React, { useState } from 'react';
import { useMutation } from "@tanstack/react-query";

import { logIn } from "~/api/auth/routes";
import { LoginDto } from "~/api/auth/dtos";
import store from "~/store";
import PageContainer from "~/components/PageContainer";

const Auth: React.FC = () => {
  const router = useIonRouter();
  const { userStore } = store
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: (data: LoginDto) => logIn(data),
  })

  const handleLogin = async () => {
    const res = await mutation.mutateAsync({ email, password });

    if (res) {
      userStore.logIn(res);
      router.push('/');
    }
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
          <IonInput label={'Email'} value={email} onIonChange={e => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonInput label={'Hasło'} type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" onClick={handleLogin}>Zaloguj się</IonButton>
      </IonContent>
    </PageContainer>
  );
};

export default Auth;
