import { useQuery } from "@tanstack/react-query";
import React from "react";

import RecruitmentsApi from "~/api/recruitments";
import { ISettlementDto } from "~/api/settlements/dtos";
import { CurrentRecruitments } from "~/components/Settlements/Recruitments/CurrentRecruitments";
import { RecruitUnit } from "~/components/Settlements/Recruitments/RecruitUnit";
import { UnitType, UnitTypeName } from "~/types/army";

interface IRecruitments {
  settlementData: ISettlementDto;
}

export function Recruitments({ settlementData }: IRecruitments) {
  const recruitmentsApi = new RecruitmentsApi();
  const { data: currentRecruitments, refetch } = useQuery({
    queryKey: ["currentRecruitments", settlementData.id],
    queryFn: () =>
      recruitmentsApi.getUnfinishedRecruitmentsBySettlementId(
        settlementData.id,
      ),
    refetchInterval: 5000,
  });

  return (
    <>
      <CurrentRecruitments
        currentRecruitments={currentRecruitments}
        refetchRecruitments={refetch}
      />

      {Object.values(UnitType).map((unitType) => (
        <RecruitUnit
          key={unitType}
          unitType={unitType as UnitTypeName}
          settlementData={settlementData}
          unitImage={`/assets/units/${unitType.toLowerCase()}.webp`}
          refetch={refetch}
        />
      ))}
    </>
  );
}
