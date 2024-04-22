import { SettlementTypes } from "~/api/settlements/dtos";
import { UnitType } from "~/types/army";

export enum ResourceType {
  wood = "wood",
  gold = "gold",
}

interface IResourceCosts {
  [ResourceType.gold]?: number;
  [ResourceType.wood]?: number;
}

interface IUnitRecruitment {
  COST: IResourceCosts;
  TIME_MS: number;
}

interface IRecruitment {
  [UnitType.SWORDSMAN]?: IUnitRecruitment;
  [UnitType.ARCHER]?: IUnitRecruitment;
  [UnitType.KNIGHT]?: IUnitRecruitment;
  [UnitType.LUCHADOR]?: IUnitRecruitment;
  [UnitType.ARCHMAGE]?: IUnitRecruitment;
}

interface IResourcesCap {
  [ResourceType.gold]: number;
  [ResourceType.wood]: number;
}

interface IResourceGenerationBase {
  [ResourceType.wood]: number;
  [ResourceType.gold]: number;
}

interface ISettlementConfig {
  MAX: number | "infinite";
  RECRUITMENT: IRecruitment;
  RESOURCES_CAP: IResourcesCap;
  RESOURCE_GENERATION_BASE: IResourceGenerationBase;
}

export interface IGameConfigDto {
  DEFAULT_MAX_RADIUS_TO_TAKE_ACTION_METERS: number;
  DEFAULT_MAX_USER_SPEED_METERS_PER_SECOND: number;
  SETTLEMENT: {
    [SettlementTypes.MINING_TOWN]: ISettlementConfig;
    [SettlementTypes.CASTLE_TOWN]: ISettlementConfig;
    [SettlementTypes.FORTIFIED_SETTLEMENT]: ISettlementConfig;
    [SettlementTypes.CAPITOL_SETTLEMENT]: ISettlementConfig;
  };
}
