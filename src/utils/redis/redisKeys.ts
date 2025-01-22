export const redisKeys = {
  lolgraphsUrl: (lolgraphsUrl: string) =>
    `/lolgraphs/${encodeURIComponent(lolgraphsUrl)}`,
  leagueMatch: (leagueMatchId: string) => `/leagueMatch/${leagueMatchId}`,

  weatherForecast: (params: { lat: number; lon: number }) =>
    `/weatherForecast/${params.lat},${params.lon}`,
} as const
