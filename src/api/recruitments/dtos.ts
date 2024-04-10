export interface IRequestRecruitmentDto {
  settlementId: string;
  unitCount: number;
  unitType: "knights" | "archers";
}

export interface IResponseRecruitmentDto {
  settlementId: string;
  unitCount: number;
  unitType: "knights" | "archers";
  finishesOn: Date;
}
