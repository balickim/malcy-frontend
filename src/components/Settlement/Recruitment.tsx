import { IonButton, IonIcon } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { trashOutline } from "ionicons/icons";
import React from "react";
import { toast } from "react-hot-toast";

import { IResponseRecruitmentDto } from "~/api/settlements/dtos";
import { cancelRecruitment } from "~/api/settlements/routes";
import { IJob } from "~/types/common";

interface IRecruitment {
  recruitmentJob: IJob<IResponseRecruitmentDto>;
  refetchRecruitments: () => Promise<unknown>;
}

export function Recruitment({
  recruitmentJob,
  refetchRecruitments,
}: IRecruitment) {
  const { mutateAsync } = useMutation({
    mutationFn: () =>
      cancelRecruitment(recruitmentJob.data.settlementId, recruitmentJob.id),
  });
  const recruitedUnits = recruitmentJob.progress;
  const totalUnits = recruitmentJob.data.unitCount;
  const endTimeFormatted = new Date(
    recruitmentJob.data.finishesOn,
  ).toLocaleTimeString();

  const handleCancel = async () => {
    return mutateAsync().then((res) => {
      if (res.statusCode === 200) {
        toast.success("Rekrutacja anulowana");
        refetchRecruitments();
      }
    });
  };

  return (
    <div className="bg-white shadow-md rounded p-4 max-w-sm w-full mx-auto">
      <h2 className="text-lg font-semibold mb-2">
        Rekrutacja: {recruitmentJob.data.unitType}
      </h2>
      <p className="text-gray-700">
        Jednostka: {recruitedUnits}/{totalUnits}
      </p>
      <p className="text-gray-700">Czas zakończenia: {endTimeFormatted}</p>
      <IonButton onClick={() => handleCancel()} className={"text-black"}>
        <IonIcon slot="icon-only" md={trashOutline} ios={trashOutline} />
      </IonButton>
    </div>
  );
}
