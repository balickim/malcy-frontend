import { useQuery } from "@tanstack/react-query";
import React from "react";

import SettlementsApi from "~/api/settlements";
import { ISettlementDto } from "~/api/settlements/dtos";
import { UnitType } from "~/types/army";

interface IGarrison {
  settlementData: ISettlementDto;
}

export function Garrison({ settlementData }: IGarrison) {
  const settlementsApi = new SettlementsApi();
  const { data, isPending } = useQuery({
    queryKey: ["settlementId", settlementData.id],
    queryFn: () => settlementsApi.getSettlementById(settlementData.id),
    refetchOnWindowFocus: "always",
  });

  return (
    <div className={"flex flex-col items-center"}>
      <p className={"text-xl"}>Garnizon</p>
      <div>
        Miecznicy:{" "}
        {isPending ? (
          <p className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data[UnitType.SWORDSMAN]
        )}
      </div>
      <div>
        Łucznicy:{" "}
        {isPending ? (
          <p className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data[UnitType.ARCHER]
        )}
      </div>
      <div>
        Rycerze:{" "}
        {isPending ? (
          <p className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data[UnitType.KNIGHT]
        )}
      </div>
      <div>
        Luczador:{" "}
        {isPending ? (
          <p className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data[UnitType.LUCHADOR]
        )}
      </div>
      <div>
        Arcymagowie:{" "}
        {isPending ? (
          <p className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data[UnitType.ARCHMAGE]
        )}
      </div>
    </div>
  );
}
