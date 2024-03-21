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
  user_createdAt: string;
  user_deletedAt: string | null;
  user_email: string;
  user_id: string;
  user_nick: string;
  user_updatedAt: string;
}
