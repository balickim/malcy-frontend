import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { Route } from 'react-router-dom';
import {
  mapOutline,
  mapSharp,
  logInOutline,
  logInSharp
} from 'ionicons/icons';
import './style.css';
import { Redirect } from "react-router";

import Map from "~/pages/Map";
import Login from "~/pages/Auth";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  Component: React.FC;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    iosIcon: mapOutline,
    mdIcon: mapSharp,
    Component: Map
  },
  {
    title: 'Login',
    url: '/login',
    iosIcon: logInOutline,
    mdIcon: logInSharp,
    Component: Login
  },
];

const MenuRouter: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/home" />
        {appPages.map((page, index) => (
          <Route key={index} path={page.url} render={() => <page.Component />} exact={true} />
        ))}
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        {appPages.map((page, index) => (
          <IonTabButton key={index} tab={page.title.toLowerCase()} href={page.url}>
            <IonIcon icon={page.iosIcon} />
            <IonLabel>{page.title}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};

export default MenuRouter;
