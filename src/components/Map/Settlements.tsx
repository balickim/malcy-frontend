import MarkerClusterGroup from "react-leaflet-cluster";
import { Marker } from "react-leaflet";
import React, { useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import L from "leaflet";

import { IBounds } from "~/types/settlement";
import { SettlementDto } from "~/api/settlements/dtos";
import { getSettlements } from "~/api/settlements/routes";
import { convertBoundsToSearchParams } from "~/utils/formatters";
import { socket } from "~/api/socket";
import ViewSettlementModal from "~/components/Map/ViewSettlementModal";

interface ISettlements {
  bounds: IBounds
}

export default function Settlements({ bounds }: ISettlements) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [settlements, setSettlements] = useState<SettlementDto[]>([])
  const [selectedSettlementData, setSelectedSettlementData] = useState<SettlementDto | undefined>()
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
    <>
      <MarkerClusterGroup chunkedLoading>
        {settlements.map((markerPos, idx) => (
          <Marker
            key={idx}
            position={markerPos}
            icon={settlementIcon}
            eventHandlers={{
              click: (e) => {
                setIsModalOpen(true);
                setSelectedSettlementData(markerPos)
              },
            }}
          />
        ))}
        {fooEvents.map((markerPos, idx) => (
          <Marker key={idx} position={markerPos} />
        ))}
      </MarkerClusterGroup>

      <ViewSettlementModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        settlementData={selectedSettlementData}
      />
    </>
  )
}