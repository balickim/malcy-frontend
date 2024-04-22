import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import React from "react";

import SettlementsApi from "~/api/settlements";
import { ISettlementDto } from "~/api/settlements/dtos";
import { UnitSlider } from "~/components/Settlements/UnitSlider";
import store from "~/store";
import { UnitType } from "~/types/army";
import { useUser } from "~/utils/useUser";

interface IViewSettlementModal {
  isOpen: boolean;
  closeModal: () => void;
  settlementData: ISettlementDto;
  type?: "pick_up" | "put_down";
}

export default function PickUpOrPutDownArmyModal({
  isOpen,
  closeModal,
  settlementData,
  type,
}: IViewSettlementModal) {
  const settlementsApi = new SettlementsApi();
  const user = useUser({ enabled: false });
  const { userStore } = store;
  const pickUpArmyMutation = useMutation({
    mutationFn:
      type === "pick_up"
        ? settlementsApi.pickUpArmy
        : settlementsApi.putDownArmy,
  });

  return (
    <IonModal isOpen={isOpen} onWillDismiss={() => closeModal()}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => closeModal()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            {type === "pick_up" ? <>Podnieś żołnierzy</> : <>Upuść żołnierzy</>}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Formik
          initialValues={{
            [UnitType.SWORDSMAN]: 0,
            [UnitType.ARCHER]: 0,
            [UnitType.KNIGHT]: 0,
            [UnitType.LUCHADOR]: 0,
            [UnitType.ARCHMAGE]: 0,
          }}
          onSubmit={async (values, formikHelpers) => {
            await pickUpArmyMutation.mutateAsync({
              settlementId: settlementData?.id,
              ...values,
            });
            formikHelpers.resetForm();
            await user.refetch();
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <>
              <form onSubmit={handleSubmit}>
                {Object.values(UnitType).map((unitType) => {
                  const max =
                    type === "put_down"
                      ? userStore.user.army[unitType]
                      : settlementData.army![unitType];
                  return (
                    <div key={unitType} className={"flex items-center mx-20"}>
                      <UnitSlider
                        unitType={unitType}
                        unitCount={values[unitType]}
                        setUnitCount={(unitCount) =>
                          setFieldValue(unitType, unitCount)
                        }
                        min={0}
                        max={max}
                        disabled={max === 0}
                      />
                      <p
                        className={
                          "text-cyan-300 hover:cursor-pointer hover:text-cyan-500"
                        }
                        onClick={() =>
                          setFieldValue(unitType, max - values[unitType])
                        }
                      >
                        ({max - values[unitType]})
                      </p>
                    </div>
                  );
                })}

                <IonButton fill="clear" expand="block" type="submit">
                  {type === "pick_up" ? <>Podnieś</> : <>Upuść</>}
                </IonButton>
              </form>
            </>
          )}
        </Formik>
      </IonContent>
    </IonModal>
  );
}