import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { version } from "../../../package.json";

export default function AppVersion() {
  const map = useMap();

  useEffect(() => {
    // @ts-expect-error blah
    const versionControl = L.control({ position: "bottomleft" });
    versionControl.onAdd = function () {
      const div = L.DomUtil.create("div", "info");
      div.innerHTML = `Version: ${version}`;
      return div;
    };
    versionControl.addTo(map);

    return () => {
      versionControl.remove();
    };
  }, [map]);

  return null;
}
