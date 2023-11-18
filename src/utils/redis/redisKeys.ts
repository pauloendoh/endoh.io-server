export const redisKeys = {
  lolgraphsUrl: (lolgraphsUrl: string) =>
    `/lolgraphs/${encodeURIComponent(lolgraphsUrl)}`,
  leagueMatch: (leagueMatchId: string) => `/leagueMatch/${leagueMatchId}`,
} as const
