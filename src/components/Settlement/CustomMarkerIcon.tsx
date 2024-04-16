import L from "leaflet";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ISettlementDto } from "~/api/settlements/dtos";
import { userStore as store } from "~/store/userStore";

import "./settlements.css";

interface ICustomMarkerProps {
  settlement: ISettlementDto;
  userStore: typeof store;
}

export const CustomMarkerIcon = ({
  settlement,
  userStore,
}: ICustomMarkerProps) => {
  const owned = settlement.user.id === userStore.user.id;
  const iconUrl = `assets/settlements/types/${settlement.type.toLowerCase()}.webp`;
  const iconHtml = renderToStaticMarkup(
    <div style={{ position: "relative" }}>
      <img
        src={iconUrl}
        alt={`settlement ${settlement.name} image`}
        style={{ width: "30px", height: "30px", borderRadius: "50%" }}
      />
      {owned && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "10%",
            width: "10px",
            height: "10px",
            backgroundColor: "yellow",
            borderRadius: "50%",
            transform: "translate(-50%, 0%)",
          }}
        />
      )}
    </div>,
  );

  return L.divIcon({
    html: iconHtml,
    className: "rounded-full",
    iconSize: [30, 30],
  });
};
