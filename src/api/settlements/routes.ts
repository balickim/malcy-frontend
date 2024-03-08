import { fetchWrapper } from "~/api/fetch";

export const getSettlements = async (params: any): Promise<Response | void> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/settlements/bounds?${params}`)
};
