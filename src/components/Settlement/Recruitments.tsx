import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

import { IRecruitDto, ISettlementDto } from "~/api/settlements/dtos";
import {
  getAllRecruitmentsBySettlementId,
  startRecruitment,
} from "~/api/settlements/routes";
import { Recruitment } from "~/components/Settlement/Recruitment";

interface IRecruitments {
  settlementData: ISettlementDto;
}

export function Recruitments({ settlementData }: IRecruitments) {
  const mutation = useMutation({
    mutationFn: (data: IRecruitDto) => startRecruitment(data),
  });
  const { data: currentRecruitments, refetch } = useQuery({
    queryKey: ["currentRecruitments", settlementData.id],
    queryFn: () => getAllRecruitmentsBySettlementId(settlementData.id),
  });
  const [unitCount, setUnitCount] = useState(10);

  const start = async (data: IRecruitDto) => {
    await mutation.mutateAsync(data);
    return refetch();
  };

  // const cancelRecruitment = async () => {};

  return (
    <>
      {currentRecruitments &&
        currentRecruitments?.data.map((recruitment) => (
          <Recruitment key={recruitment.id} recruitment={recruitment} />
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
        {/*<button onClick={cancelRecruitment}>Cancel Recruitment</button>*/}
      </div>
    </>
  );
}
