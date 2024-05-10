import { LatLngTuple } from "leaflet";

import { fetchWrapper } from "~/api/fetch";
import { IApiResponse } from "~/types/common";

export default class FogOfWarApi {
  private readonly basePath = `${import.meta.env.VITE_API_URL}/fog-of-war`;

  getUsersDiscoveredAreas = async (): Promise<IApiResponse<LatLngTuple[]>> => {
    return fetchWrapper(`${this.basePath}/discovered-areas`);
  };

  getUsersVisibleAreas = async (): Promise<IApiResponse<LatLngTuple[]>> => {
    return fetchWrapper(`${this.basePath}/visible-areas`);
  };
}
