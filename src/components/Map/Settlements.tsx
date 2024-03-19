import MarkerClusterGroup from "react-leaflet-cluster";
import {Marker, Popup} from "react-leaflet";
import React, {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import L from "leaflet";

import { IBounds } from "~/types/settlement";
import { SettlementDto } from "~/api/settlements/dtos";
import { getSettlements } from "~/api/settlements/routes";
import { convertBoundsToSearchParams } from "~/utils/formatters";
import { socket } from "~/api/socket";

export default function Settlements({ bounds }: { bounds: IBounds }) {
  const [settlements, setSettlements] = useState<SettlementDto[]>([])
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const { data, isSuccess} = useQuery({
    queryKey: ['settlementBounds', bounds],
    queryFn: () => getSettlements(new URLSearchParams(convertBoundsToSearchParams(bounds)))
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

  useEffect(() => {
    function onFooEvent(value: any) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('foo', onFooEvent);
    return () => {
      socket.off('foo', onFooEvent);
    };
  }, []);

  const settlementIcon = L.icon({
    iconUrl: 'assets/settlement_0.png',
    iconSize: [35, 35],
  });

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
      {fooEvents.map((markerPos, idx) => (
        <Marker key={idx} position={markerPos} />
      ))}
    </MarkerClusterGroup>
  )
}