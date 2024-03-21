import { IonApp, setupIonicReact } from "@ionic/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { Toaster } from "react-hot-toast";

import AppVersion from "~/components/AppVersion";
import MenuRouter from "~/components/MenuRouter/MenuRouter";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App = () => {
  const queryClient = new QueryClient();

  return (
    <IonApp>
      <QueryClientProvider client={queryClient}>
        <MenuRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

      <Toaster position={"top-right"} />
      <AppVersion />
    </IonApp>
  );
};

export default App;
