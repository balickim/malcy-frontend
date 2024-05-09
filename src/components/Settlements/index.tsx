import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import SettlementsApi from "~/api/settlements";
import { ISettlementDto } from "~/api/settlements/dtos";
import { baseSocket } from "~/api/socket";
import ContextMenu from "~/components/ContextMenu";
import { CustomMarkerIcon } from "~/components/Settlements/CustomMarkerIcon";
import PickUpOrPutDownArmyModal from "~/components/Settlements/Modals/PickUpOrPutDownArmyModal";
import ViewSettlementModal from "~/components/Settlements/Modals/ViewSettlementModal";
import store from "~/store";
import { IBounds } from "~/types/settlement";

export default function Settlements() {
  const settlementsApi = new SettlementsApi();
  const { userStore } = store;
  const map = useMap();
  const [bounds, setBounds] = useState<IBounds>();
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [settlements, setSettlements] = useState<ISettlementDto[]>([]);
  const [openedModal, setOpenedModal] = useState<
    "pick_up" | "put_down" | undefined
  >(undefined);
  const [contextMenuData, setContextMenuData] = useState<
    | {
        position: {
          x: number;
          y: number;
        } | null;
        settlement: ISettlementDto;
      }
    | undefined
  >(undefined);
  const { data, isSuccess } = useQuery({
    queryKey: ["settlementBounds", bounds],
    queryFn: () => (bounds ? settlementsApi.getSettlements(bounds) : undefined),
    enabled: !!bounds,
    refetchInterval: 5000,
  });

  useEffect(() => {
    const onMapMove = () => {
      const tmpBounds = map.getBounds();
      const northEastLat = tmpBounds.getNorthEast().lat;
      const northEastLng = tmpBounds.getNorthEast().lng;
      const southWestLat = tmpBounds.getSouthWest().lat;
      const southWestLng = tmpBounds.getSouthWest().lng;

      setBounds({ northEastLat, northEastLng, southWestLat, southWestLng });
    };

    onMapMove();
    map.on("moveend", onMapMove);
    return () => {
      map.off("moveend", onMapMove);
    };
  }, [map]);

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

    baseSocket.on("newSettlement", newSettlement);
    return () => {
      baseSocket.off("newSettlement", newSettlement);
    };
  }, []);

  const closeModals = useCallback(() => {
    setIsSettlementModalOpen(false);
    setOpenedModal(undefined);
    setContextMenuData(undefined);
  }, []);

  const handleMarkerClick = (
    settlement: ISettlementDto,
    event: L.LeafletMouseEvent,
  ) => {
    setContextMenuData({ settlement, position: event.containerPoint });
  };

  const MemoizedMarker = memo(
    ({
      settlement,
      onMarkerClick,
    }: {
      settlement: ISettlementDto;
      onMarkerClick: (event: L.LeafletMouseEvent) => void;
    }) => (
      <Marker
        key={settlement.id}
        position={settlement}
        icon={CustomMarkerIcon({
          settlement,
          userStore,
        })}
        eventHandlers={{
          click: onMarkerClick,
        }}
      />
    ),
  );
  MemoizedMarker.displayName = "MemoizedMarker";
  const renderContextMenu = () => {
    if (!contextMenuData || !contextMenuData.position) return null;

    const isOwn = contextMenuData.settlement.user.id === userStore.user.id;
    return (
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
          ...(isOwn
            ? [
                {
                  icon: "assets/malcy_leap_off_hand.png",
                  onClick: () => setOpenedModal("put_down"),
                },
                {
                  icon: "assets/malcy_take_up.webp",
                  onClick: () => setOpenedModal("pick_up"),
                },
              ]
            : []),
        ]}
      />
    );
  };
  return (
    <>
      <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={18}>
        {settlements.map((settlement) => {
          return (
            <MemoizedMarker
              key={settlement.id}
              settlement={settlement}
              onMarkerClick={(event) => handleMarkerClick(settlement, event)}
            />
          );
        })}
      </MarkerClusterGroup>

      <ViewSettlementModal
        isOpen={isSettlementModalOpen}
        closeModal={closeModals}
        settlementId={contextMenuData && contextMenuData.settlement.id}
      />
      <PickUpOrPutDownArmyModal
        type={openedModal}
        isOpen={!!openedModal}
        closeModal={closeModals}
        settlementId={contextMenuData && contextMenuData.settlement.id}
      />

      {renderContextMenu()}
    </>
  );
}
