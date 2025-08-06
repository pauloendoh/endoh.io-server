import myRedis from "./myRedis"

export async function cacheCallback<T>(
  cacheKey: string,
  run: () => Promise<T>,
  ttlInSeconds = 60 * 60
): Promise<T> {
  const cachedValue = await myRedis.get(cacheKey)
  if (cachedValue) {
    console.log(`Cache hit for key: ${cacheKey}`)
    return JSON.parse(cachedValue) as T
  }

  const result = await run()

  await myRedis.set(cacheKey, JSON.stringify(result), "EX", ttlInSeconds)

  return result
}
