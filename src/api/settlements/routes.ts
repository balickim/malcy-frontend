import { fetchWrapper } from "~/api/fetch";
import { IBounds } from "~/types/settlement";
import { convertBoundsToSearchParams } from "~/utils/formatters";

export const getSettlements = async (
  bounds: IBounds,
): Promise<Response | void> => {
  const data = new URLSearchParams(convertBoundsToSearchParams(bounds));
  return fetchWrapper(
    `${import.meta.env.VITE_API_URL}/settlements/bounds?${data}`,
  );
};
