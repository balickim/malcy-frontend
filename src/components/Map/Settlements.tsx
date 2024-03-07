import MarkerClusterGroup from "react-leaflet-cluster";
import {Marker, Popup} from "react-leaflet";
import React, {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import L from "leaflet";

import {IBounds} from "../../types/settlement";
import {SettlementDto} from "../../api/settlements/dtos";

export default function Settlements({ bounds }: { bounds: IBounds }) {
  const [settlements, setSettlements] = useState<SettlementDto[]>([])
  const { data, isSuccess} = useQuery({
    queryKey: ['settlementBounds', { southWestLat: bounds?.swlat, southWestLng: bounds?.swlng, northEastLat: bounds?.nelat, northEastLng: bounds?.nelng }],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/settlement/bounds?southWestLat=${bounds?.swlat}&southWestLng=${bounds?.swlng}&northEastLat=${bounds?.nelat}&northEastLng=${bounds?.nelng}`)
      return res.json()
    },
  })

  useEffect(() => {
    if (isSuccess) {
      setSettlements((previous) => {
        const newValues = Array.isArray(data) ? data : [data];
        const filteredNewValues = newValues.filter(nv => !previous.some((pv: any) => pv.id === nv.id));
        return [...previous, ...filteredNewValues];
      });
    }
  }, [isSuccess])

  const settlementIcon = L.icon({
    iconUrl: 'assets/settlement_0.png',
    iconSize: [35, 35],
  });

  if (settlements && !settlements.length) return null
  return (
    <MarkerClusterGroup chunkedLoading>
      {settlements.map((markerPos, idx) => (
        <Marker key={idx} position={markerPos} icon={settlementIcon}>
          <Popup>
            <img src={'assets/settlement_0.png'} alt="settlement_0"/>
            <pre>{JSON.stringify(markerPos, null, 2)}</pre>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  )
}