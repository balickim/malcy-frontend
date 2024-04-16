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
}

export interface ISettlementDetailsDto {
  knights: number;
  archers: number;
}

export interface IRequestPickUpArmyDto {
  settlementId?: string;
  knights: number;
  archers: number;
}

export interface IRequestPutDownArmyDto {
  settlementId?: string;
  knights: number;
  archers: number;
}
