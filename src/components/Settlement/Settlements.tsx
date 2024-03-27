import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import { ISettlementDto, SettlementType } from "~/api/settlements/dtos";
import { getSettlements } from "~/api/settlements/routes";
import { socket } from "~/api/socket";
import ViewSettlementModal from "~/components/Settlement/ViewSettlementModal";
import store from "~/store";
import { IBounds } from "~/types/settlement";

interface ISettlements {
  bounds?: IBounds;
}

export default function Settlements({ bounds }: ISettlements) {
  const { userStore } = store;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settlements, setSettlements] = useState<ISettlementDto[]>([]);
  const [selectedSettlementData, setSelectedSettlementData] =
    useState<ISettlementDto>();
  const { data, isSuccess } = useQuery({
    queryKey: ["settlementBounds", bounds],
    queryFn: () => (bounds ? getSettlements(bounds) : undefined),
  });

  useEffect(() => {
    if (isSuccess) {
      setSettlements((previous) => {
        const newValues = Array.isArray(data?.data) ? data?.data : [data?.data];
        const updatedSettlements = new Map(previous.map((s) => [s.id, s]));

        newValues.forEach((nv) => {
          updatedSettlements.set(nv.id, nv);
        });

        return Array.from(updatedSettlements.values());
      });
    }
  }, [isSuccess, data?.data]);

  useEffect(() => {
    function newSettlement(value: ISettlementDto) {
      setSettlements((previous) => {
        const updatedSettlements = new Map(previous.map((s) => [s.id, s]));
        updatedSettlements.set(value.id, value);
        return Array.from(updatedSettlements.values());
      });
    }

    socket.on("newSettlement", newSettlement);
    return () => {
      socket.off("newSettlement", newSettlement);
    };
  }, []);

  const settlementIcon = (type: SettlementType, owned: boolean) => {
    let baseIconUrl = "assets/settlement";
    const typeString = `_${type}`;
    const ownedString = `_owned`;
    if (type) baseIconUrl = baseIconUrl + typeString;
    if (owned) baseIconUrl = baseIconUrl + ownedString;

    return L.icon({
      iconUrl: baseIconUrl + ".png",
      iconSize: [35, 35],
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSettlementData(undefined);
  };

  return (
    <>
      <MarkerClusterGroup chunkedLoading>
        {settlements.map((settlement) => (
          <Marker
            key={settlement.id}
            position={settlement}
            icon={settlementIcon(
              settlement.type,
              settlement.user.id === userStore.user.id,
            )}
            eventHandlers={{
              click: () => {
                setIsModalOpen(true);
                setSelectedSettlementData(settlement);
              },
            }}
          />
        ))}
      </MarkerClusterGroup>

      <ViewSettlementModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        settlementData={selectedSettlementData}
      />
    </>
  );
}
