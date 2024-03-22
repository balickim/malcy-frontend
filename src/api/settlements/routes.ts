import { fetchWrapper } from "~/api/fetch";
import { ISettlementDto } from "~/api/settlements/dtos";
import { IApiResponse } from "~/types/common";
import { IBounds } from "~/types/settlement";
import { convertBoundsToSearchParams } from "~/utils/formatters";

export const getSettlements = async (
  bounds: IBounds,
): Promise<IApiResponse<ISettlementDto>> => {
  const data = new URLSearchParams(convertBoundsToSearchParams(bounds));
  return fetchWrapper(
    `${import.meta.env.VITE_API_URL}/settlements/bounds?${data}`,
  );
};
