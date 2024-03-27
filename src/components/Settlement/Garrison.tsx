import { useQuery } from "@tanstack/react-query";
import React from "react";

import { ISettlementDto } from "~/api/settlements/dtos";
import { getSettlementById } from "~/api/settlements/routes";

interface IGarrison {
  settlementData: ISettlementDto;
}

export function Garrison({ settlementData }: IGarrison) {
  const { data, isPending } = useQuery({
    queryKey: ["settlementId", settlementData.id],
    queryFn: () => getSettlementById(settlementData.id),
    refetchOnWindowFocus: "always",
  });

  return (
    <div className={"flex flex-col items-center"}>
      <p className={"text-xl"}>Garnizon</p>
      <p>
        Rycerze:{" "}
        {isPending ? (
          <div className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data.knights
        )}
      </p>
      <p>
        Łucznicy:{" "}
        {isPending ? (
          <div className="w-48 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700" />
        ) : (
          data?.data.archers
        )}
      </p>
    </div>
  );
}
