import React from "react";

import { IRecruitDto } from "~/api/settlements/dtos";
import { IJob } from "~/types/common";

interface IRecruitment {
  recruitment: IJob<IRecruitDto>;
}

export function Recruitment({ recruitment }: IRecruitment) {
  const recruitedUnits = recruitment.progress;
  const totalUnits = recruitment.data.unitCount;

  const endTime =
    new Date(recruitment.timestamp).getTime() + totalUnits * 60000;
  const endTimeFormatted = new Date(endTime).toLocaleTimeString();

  return (
    <div className="bg-white shadow-md rounded p-4 max-w-sm w-full mx-auto">
      <h2 className="text-lg font-semibold mb-2">
        Rekrutacja: {recruitment.data.unitType}
      </h2>
      <p className="text-gray-700">
        Jednostka: {recruitedUnits}/{totalUnits}
      </p>
      <p className="text-gray-700">Czas zakończenia: {endTimeFormatted}</p>
    </div>
  );
}
