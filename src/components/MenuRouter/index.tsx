import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { mapOutline, mapSharp, logInOutline, logInSharp } from "ionicons/icons";
import { Redirect } from "react-router";
import { Route } from "react-router-dom";

import Login from "~/pages/Auth";
import Map from "~/pages/Map";

interface IAppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  Component: React.FC;
}

const appPages: IAppPage[] = [
  {
    title: "Home",
    url: "/home",
    iosIcon: mapOutline,
    mdIcon: mapSharp,
    Component: Map,
  },
  {
    title: "Login",
    url: "/login",
    iosIcon: logInOutline,
    mdIcon: logInSharp,
    Component: Login,
  },
];

const MenuRouter: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/home" />
        {appPages.map((page, index) => (
          <Route
            key={index}
            path={page.url}
            render={() => <page.Component />}
            exact={true}
          />
        ))}
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        {appPages.map((page, index) => (
          <IonTabButton
            key={index}
            tab={page.title.toLowerCase()}
            href={page.url}
          >
            <IonIcon icon={page.iosIcon} />
            <IonLabel>{page.title}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};

export default MenuRouter;
