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
import { useUser } from "~/utils/useUser";

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
    url: "/",
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
  useUser({ refetchInterval: 5000 });

  const menuItems: IMenuItem[] = [
    ...(userStore.isLoggedIn
      ? [
          {
            title: "Home",
            url: "/",
            iosIcon: mapOutline,
            mdIcon: mapSharp,
          },
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
      <IonTabs>
        <IonRouterOutlet id="main">
          {appPages.map((page) => (
            <Route
              key={page.url}
              path={page.url}
              render={() => {
                if (!userStore.isLoggedIn && page.url !== "/auth")
                  return <Redirect to="/auth" />;
                if (userStore.isLoggedIn && page.url === "/auth")
                  return <Redirect to="/" />;

                return <page.Component />;
              }}
              exact={true}
            />
          ))}
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          {menuItems.map((page) => (
            <IonTabButton
              key={page.url}
              tab={page.title.toLowerCase()}
              href={page.url}
            >
              <IonIcon icon={page.iosIcon} />
              <IonLabel>{page.title}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
      <AuthRedirector />
    </IonReactRouter>
  );
});
