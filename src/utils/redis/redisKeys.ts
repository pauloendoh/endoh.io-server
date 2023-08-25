export const redisKeys = {
  lolgraphsUrl: (lolgraphsUrl: string) =>
    `/lolgraphs/${encodeURIComponent(lolgraphsUrl)}`,
} as const
