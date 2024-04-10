import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import React, { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import SettlementsApi from "~/api/settlements";
import { ISettlementDto, SettlementType } from "~/api/settlements/dtos";
import { socket } from "~/api/socket";
import ContextMenu from "~/components/ContextMenu";
import PickUpArmyModal from "~/components/Settlement/PickUpArmyModal";
import PutDownArmyModal from "~/components/Settlement/PutDownArmyModal";
import ViewSettlementModal from "~/components/Settlement/ViewSettlementModal";
import store from "~/store";
import { IBounds } from "~/types/settlement";

interface ISettlements {
  bounds?: IBounds;
}

export default function Settlements({ bounds }: ISettlements) {
  const settlementsApi = new SettlementsApi();
  const { userStore } = store;
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isPickUpArmyModalOpen, setIsPickUpArmyModalOpen] = useState(false);
  const [isPutDownArmyModalOpen, setIsPutDownArmyModalOpen] = useState(false);
  const [contextMenuData, setContextMenuData] = useState<{
    position: {
      x: number;
      y: number;
    } | null;
    settlement: ISettlementDto;
  } | null>(null);

  const [settlements, setSettlements] = useState<ISettlementDto[]>([]);
  const { data, isSuccess } = useQuery({
    queryKey: ["settlementBounds", bounds],
    queryFn: () => (bounds ? settlementsApi.getSettlements(bounds) : undefined),
    enabled: !!bounds,
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
      iconSize: [30, 30],
    });
  };

  const closeModal = () => {
    setIsSettlementModalOpen(false);
  };

  const closePickUpArmyModal = () => {
    setIsPickUpArmyModalOpen(false);
  };

  const closePutDownArmyModal = () => {
    setIsPutDownArmyModalOpen(false);
  };

  const handleMarkerClick = (
    settlement: ISettlementDto,
    event: L.LeafletMouseEvent,
  ) => {
    setContextMenuData({ settlement, position: event.containerPoint });
  };

  return (
    <>
      <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={18}>
        {settlements.map((settlement) => (
          <Marker
            key={settlement.id}
            position={settlement}
            icon={settlementIcon(
              settlement.type,
              settlement.user.id === userStore.user.id,
            )}
            eventHandlers={{
              click: (event) => handleMarkerClick(settlement, event),
            }}
          />
        ))}
      </MarkerClusterGroup>

      <ViewSettlementModal
        isOpen={isSettlementModalOpen}
        closeModal={closeModal}
        settlementData={contextMenuData?.settlement}
      />
      <PickUpArmyModal
        isOpen={isPickUpArmyModalOpen}
        closeModal={closePickUpArmyModal}
        settlementId={contextMenuData?.settlement.id}
      />
      <PutDownArmyModal
        isOpen={isPutDownArmyModalOpen}
        closeModal={closePutDownArmyModal}
        settlementId={contextMenuData?.settlement.id}
      />

      {contextMenuData && contextMenuData.position ? (
        <ContextMenu
          setPosition={(position) =>
            setContextMenuData({ ...contextMenuData, position })
          }
          position={contextMenuData.position}
          items={[
            {
              icon: "assets/modal_info.png",
              onClick: () => setIsSettlementModalOpen(true),
            },
            {
              icon: "assets/malcy_leap_off_hand.png",
              onClick: () => setIsPutDownArmyModalOpen(true),
            },
            {
              icon: "assets/malcy_take_up.webp",
              onClick: () => setIsPickUpArmyModalOpen(true),
            },
          ]}
        />
      ) : null}
    </>
  );
}
