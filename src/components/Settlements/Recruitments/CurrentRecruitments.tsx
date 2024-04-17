import { IonButton, IonIcon } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { trashOutline } from "ionicons/icons";
import React from "react";
import { toast } from "react-hot-toast";

import RecruitmentsApi from "~/api/recruitments";
import { IResponseRecruitmentDto } from "~/api/recruitments/dtos";
import { IApiResponse, IJob } from "~/types/common";

interface IRecruitment {
  currentRecruitments?: IApiResponse<IJob<IResponseRecruitmentDto>[]>;
  refetchRecruitments: () => Promise<unknown>;
}

export function CurrentRecruitments({
  currentRecruitments,
  refetchRecruitments,
}: IRecruitment) {
  const recruitmentsApi = new RecruitmentsApi();

  const recruitmentMutation = useMutation({
    mutationFn: recruitmentsApi.cancelRecruitment,
  });

  const handleCancel = async (settlementId: string, jobId: number) => {
    return recruitmentMutation
      .mutateAsync({ settlementId, jobId })
      .then((res) => {
        if (res.statusCode === 200) {
          toast.success("Rekrutacja anulowana");
          refetchRecruitments();
        }
      });
  };

  if (!currentRecruitments) return null;
  return currentRecruitments.data.map((recruitmentJob) => {
    const recruitedUnits = recruitmentJob.progress;
    const totalUnits = recruitmentJob.data.unitCount;
    const endTimeFormatted = new Date(
      recruitmentJob.data.finishesOn,
    ).toLocaleTimeString();

    return (
      <div className="bg-white shadow-md rounded p-4 max-w-sm w-full mx-auto">
        <h2 className="text-lg font-semibold mb-2">
          Rekrutacja: {recruitmentJob.data.unitType}
        </h2>
        <p className="text-gray-700">
          Jednostka: {recruitedUnits}/{totalUnits}
        </p>
        <p className="text-gray-700">Czas zakończenia: {endTimeFormatted}</p>
        <IonButton
          onClick={() =>
            handleCancel(recruitmentJob.data.settlementId, recruitmentJob.id)
          }
          className={"text-black"}
        >
          <IonIcon slot="icon-only" md={trashOutline} ios={trashOutline} />
        </IonButton>
      </div>
    );
  });
}
