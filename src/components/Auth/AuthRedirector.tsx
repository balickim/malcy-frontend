import { useIonRouter } from "@ionic/react";
import React, { useEffect } from "react";

const AuthRedirector: React.FC = () => {
  const router = useIonRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      router.push("/auth");
    };
    const handleLogin = () => {
      router.push("/home");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    window.addEventListener("login", handleLogin);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
      window.removeEventListener("login", handleLogin);
    };
  }, [router]);

  return null;
};

export default AuthRedirector;
