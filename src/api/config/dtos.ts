export interface IGameConfigDto {
  DEFAULT_MAX_USER_SPEED_METERS_PER_SECOND: number;
  DEFAULT_MAX_RADIUS_TO_TAKE_ACTION_METERS: number;
  SETTLEMENT: {
    CASTLE_TOWN: {
      RECRUITMENT: { swordsman: number; archer: number };
      RESOURCE_GENERATION_BASE: { gold: number; wood: number };
      MAX: string;
      RESOURCES_CAP: { gold: number; wood: number };
    };
    FORTIFIED_SETTLEMENT: {
      RECRUITMENT: {
        swordsman: number;
        archer: number;
        knight: number;
        luchador: number;
      };
      RESOURCE_GENERATION_BASE: { gold: number; wood: number };
      MAX: string;
      RESOURCES_CAP: { gold: number; wood: number };
    };
    CAPITOL_SETTLEMENT: {
      RECRUITMENT: {
        swordsman: number;
        archer: number;
        knight: number;
        luchador: number;
        archmage: number;
      };
      RESOURCE_GENERATION_BASE: { gold: number; wood: number };
      MAX: number;
      RESOURCES_CAP: { gold: number; wood: number };
    };
    MINING_TOWN: {
      RECRUITMENT: { swordsman: number };
      RESOURCE_GENERATION_BASE: { gold: number; wood: number };
      MAX: string;
      RESOURCES_CAP: { gold: number; wood: number };
    };
  };
}
