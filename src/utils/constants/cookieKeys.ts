export const cookieKeys = {
  currentTemp: (params: { lat: number; lon: number }) =>
    `currentTemp-${params.lat}-${params.lon}`,
}
