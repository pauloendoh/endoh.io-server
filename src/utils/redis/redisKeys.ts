export const redisKeys = {
  lolgraphsUrl: (lolgraphsUrl: string) =>
    `/lolgraphs/${encodeURIComponent(lolgraphsUrl)}`,
  leagueMatch: (leagueMatchId: string) => `/leagueMatch/${leagueMatchId}`,

  weatherForecast: (params: { lat: number; lon: number }) =>
    `/weatherForecast/${params.lat},${params.lon}`,

  scrapedLolRates: "/scrapedLolRates",
  scrapedChampionsAt: "/scrapedChampionsAt",
  scrapedAramAt: "/scrapedAramAt",
  scrapedOpggAt: "/scrapedOpggAt",
  scrapedLolGraphsAt: "/scrapedLolGraphsAt",
  scrapedUggAt: "/scrapedUggAt",
} as const
