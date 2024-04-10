import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import RecruitmentsApi from "~/api/recruitments";
import { IRequestRecruitmentDto } from "~/api/recruitments/dtos";
import { ISettlementDto } from "~/api/settlements/dtos";
import { Recruitment } from "~/components/Settlement/Recruitment";

interface IRecruitments {
  settlementData: ISettlementDto;
}

export function Recruitments({ settlementData }: IRecruitments) {
  const recruitmentsApi = new RecruitmentsApi();

  const mutation = useMutation({
    mutationFn: (data: IRequestRecruitmentDto) =>
      recruitmentsApi.startRecruitment(data),
  });
  const { data: currentRecruitments, refetch } = useQuery({
    queryKey: ["currentRecruitments", settlementData.id],
    queryFn: () =>
      recruitmentsApi.getUnfinishedRecruitmentsBySettlementId(
        settlementData.id,
      ),
    refetchInterval: 5000,
  });
  const [unitCount, setUnitCount] = useState(10);

  const start = async (data: IRequestRecruitmentDto) => {
    await mutation.mutateAsync(data);
    return refetch();
  };

  return (
    <>
      {currentRecruitments &&
        currentRecruitments?.data.map((recruitment) => (
          <Recruitment
            key={recruitment.id}
            recruitmentJob={recruitment}
            refetchRecruitments={refetch}
          />
        ))}
      <div>
        <input
          type="number"
          value={unitCount}
          onChange={(e) => setUnitCount(e.target.value as unknown as number)}
        />
        <button
          onClick={() =>
            start({
              unitCount,
              unitType: "knights",
              settlementId: settlementData.id,
            })
          }
        >
          Start Recruitment
        </button>
      </div>
    </>
  );
}
