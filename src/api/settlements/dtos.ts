export enum SettlementType {
  village = "village",
  town = "town",
  city = "city",
}

export interface ISettlementDto {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: SettlementType;
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
