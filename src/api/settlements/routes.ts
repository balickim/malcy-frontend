import {IBounds} from "../../types/settlement";

export const getSettlements = async (bounds: IBounds): Promise<Response> => {
  const params = new URLSearchParams({
    southWestLat: bounds.southWestLat.toString(),
    southWestLng: bounds.southWestLng.toString(),
    northEastLat: bounds.northEastLat.toString(),
    northEastLng: bounds.northEastLng.toString(),
  });

  const res = await fetch(`${import.meta.env.VITE_API_URL}/settlement/bounds?${params}`)
  return res.json();
};
