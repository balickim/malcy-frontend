import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { mapOutline, mapSharp, logInOutline, logInSharp } from "ionicons/icons";
import React from "react";
import { Redirect } from "react-router";
import { Route } from "react-router-dom";

import AuthRedirector from "~/components/Auth/AuthRedirector";
import Login from "~/pages/Auth";
import Map from "~/pages/Map";
import store from "~/store";

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
  const { userStore } = store;
  return (
    <IonReactRouter>
      <IonRouterOutlet id="main">
        <>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/" render={() => <Redirect to="/home" />} />
              {appPages.map((page, index) => (
                <Route
                  key={index}
                  path={page.url}
                  render={() =>
                    !userStore.isLoggedIn && page.url !== "/login" ? (
                      <Redirect to="/login" />
                    ) : (
                      <page.Component />
                    )
                  }
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
        </>
      </IonRouterOutlet>

      <AuthRedirector />
    </IonReactRouter>
  );
};

export default MenuRouter;
