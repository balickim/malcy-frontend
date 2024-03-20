import { useIonRouter } from "@ionic/react";
import React, { useEffect } from "react";

const AuthRedirector: React.FC = () => {
  const router = useIonRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      router.push("/login");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [router]);

  return null;
};

export default AuthRedirector;
