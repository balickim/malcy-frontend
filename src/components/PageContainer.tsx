import { IonContent, IonPage } from '@ionic/react';

interface IPage {
  children: React.ReactNode
}

const PageContainer = ({ children }: IPage) => {
  return (
    <IonPage>
      <IonContent fullscreen>
        {children}
      </IonContent>
    </IonPage>
  );
};

export default PageContainer;
