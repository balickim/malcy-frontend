import { IonPopover, IonRange } from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import RecruitmentsApi from "~/api/recruitments";
import { IRequestRecruitmentDto } from "~/api/recruitments/dtos";
import { UnitType } from "~/types/army";

interface IRecruitUnitProps {
  unitType: (typeof UnitType)[keyof typeof UnitType];
  settlementId: string;
  unitImage: string;
  refetch: () => void;
}

export const RecruitUnit: React.FC<IRecruitUnitProps> = ({
  unitType,
  settlementId,
  unitImage,
  refetch,
}) => {
  const recruitmentsApi = new RecruitmentsApi();
  const [unitCount, setUnitCount] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: (data: IRequestRecruitmentDto) =>
      recruitmentsApi.startRecruitment(data),
  });

  const start = async (data: IRequestRecruitmentDto) => {
    await mutation.mutateAsync(data);
    setUnitCount(0);
    return refetch();
  };

  return (
    <div className="flex items-center gap-2 mx-auto">
      <IonPopover
        trigger={`trigger-${unitType}`}
        triggerAction="hover"
        showBackdrop={false}
      >
        <img src={unitImage} alt={unitType} />
      </IonPopover>
      <img
        id={`trigger-${unitType}`}
        src={unitImage}
        alt={unitType}
        className="h-16 w-16"
      />
      <IonRange
        min={0}
        max={100}
        step={1}
        value={unitCount}
        onIonInput={(e) => setUnitCount(e.detail.value as number)}
        className="flex-1"
      />
      <input
        type="number"
        value={unitCount}
        onChange={(e) => setUnitCount(parseInt(e.target.value))}
        className="w-10 text-center"
      />
      <button
        onClick={() => start({ unitCount, unitType, settlementId })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Zrekrutuj
      </button>
    </div>
  );
};
