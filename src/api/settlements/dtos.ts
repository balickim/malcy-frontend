import { TArmy, UnitType } from "~/types/army";

export enum SettlementTypes {
  MINING_TOWN = "MINING_TOWN",
  CASTLE_TOWN = "CASTLE_TOWN",
  FORTIFIED_SETTLEMENT = "FORTIFIED_SETTLEMENT",
  CAPITOL_SETTLEMENT = "CAPITOL_SETTLEMENT",
}

export interface ISettlementDto {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: SettlementTypes;
  user: {
    createdAt: string;
    deletedAt: string | null;
    email: string;
    id: string;
    nick: string;
    updatedAt: string;
  };
  army: TArmy;
}

export interface ISettlementDetailsDto {
  [UnitType.SWORDSMAN]: number;
  [UnitType.ARCHER]: number;
  [UnitType.KNIGHT]: number;
  [UnitType.LUCHADOR]: number;
  [UnitType.ARCHMAGE]: number;
}

export interface IRequestPickUpArmyDto {
  settlementId?: string;
  [UnitType.SWORDSMAN]: number;
  [UnitType.ARCHER]: number;
  [UnitType.KNIGHT]: number;
  [UnitType.LUCHADOR]: number;
  [UnitType.ARCHMAGE]: number;
}

export interface IRequestPutDownArmyDto {
  settlementId?: string;
  [UnitType.SWORDSMAN]: number;
  [UnitType.ARCHER]: number;
  [UnitType.KNIGHT]: number;
  [UnitType.LUCHADOR]: number;
  [UnitType.ARCHMAGE]: number;
}
