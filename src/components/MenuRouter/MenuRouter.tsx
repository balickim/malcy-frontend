import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  mapOutline,
  mapSharp,
  logInOutline,
  logInSharp,
  personOutline,
  personSharp,
} from "ionicons/icons";
import { observer } from "mobx-react-lite";
import React from "react";
import { Redirect } from "react-router";
import { Route } from "react-router-dom";

import AuthRedirector from "~/components/Auth/AuthRedirector";
import Account from "~/pages/Account";
import Auth from "~/pages/Auth";
import Map from "~/pages/Map";
import store from "~/store";

interface IAppPage {
  url: string;
  Component: React.FC;
}

interface IMenuItem {
  iosIcon: string;
  mdIcon: string;
  title: string;
  url: string;
}

const appPages: IAppPage[] = [
  {
    url: "/home",
    Component: Map,
  },
  {
    url: "/auth",
    Component: Auth,
  },
  {
    url: "/account",
    Component: Account,
  },
];

export default observer(function MenuRouter() {
  const { userStore } = store;

  const menuItems: IMenuItem[] = [
    {
      title: "Home",
      url: "/home",
      iosIcon: mapOutline,
      mdIcon: mapSharp,
    },
    ...(userStore.isLoggedIn
      ? [
          {
            title: "Konto",
            url: "/account",
            iosIcon: personOutline,
            mdIcon: personSharp,
          },
        ]
      : [
          {
            title: "Logowanie/Rejestracja",
            url: "/auth",
            iosIcon: logInOutline,
            mdIcon: logInSharp,
          },
        ]),
  ];

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
                    !userStore.isLoggedIn && page.url !== "/auth" ? (
                      <Redirect to="/auth" />
                    ) : (
                      <page.Component />
                    )
                  }
                  exact={true}
                />
              ))}
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              {menuItems.map((page, index) => (
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
});
