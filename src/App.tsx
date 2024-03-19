import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  useIonRouter
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Menu from '~/components/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App = () => {
  const router = useIonRouter();
  const queryClient = new QueryClient();

  useEffect(() => {
    const handleUnauthorized = () => {
      router.push('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [router]);

  return (
    <IonApp>
      <QueryClientProvider client={queryClient}>
        <IonReactRouter>
          <IonRouterOutlet id="main">
            <Menu />
          </IonRouterOutlet>
          <ReactQueryDevtools initialIsOpen={false} />
        </IonReactRouter>
      </QueryClientProvider>

      <Toaster position={'top-right'} />
    </IonApp>
  );
};

export default App;
