export enum SettlementType {
  village = "village",
  town = "town",
  city = "city",
}

export interface SettlementDto {
  id: string;
  name: string;
  userid: string;
  type: SettlementType;
  lng: number;
  lat: number;
}
