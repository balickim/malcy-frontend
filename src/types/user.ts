import { TArmy } from "~/types/army";

export interface IUser {
  createdAt: Date;
  deletedAt: Date | null;
  email: string;
  id: string;
  nick: string;
  updatedAt: Date;
  army: TArmy;
}
