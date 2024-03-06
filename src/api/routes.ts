export const getSettlements = ({swlat, swlng, nelat, nelng}: {
  swlat: number,
  swlng: number,
  nelat: number,
  nelng: number
}): Promise<Response> => {
  const params = new URLSearchParams({
    southWestLat: swlat.toString(),
    southWestLng: swlng.toString(),
    northEastLat: nelat.toString(),
    northEastLng: nelng.toString(),
  });

  return fetch(`${import.meta.env.VITE_API_URL}/settlement/bounds?${params.toString()}`);
};
