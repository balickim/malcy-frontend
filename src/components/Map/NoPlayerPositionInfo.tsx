import { IonLoading } from "@ionic/react";
import React from "react";

export function NoPlayerPositionInfo() {
  return <IonLoading isOpen message="Czekam na ustalenie pozycji gracza" />;
}
