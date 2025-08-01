import myRedis from "./myRedis"

export async function cacheRun<T>(
  key: string,
  run: () => Promise<T>,
  ttlSeconds = 60 * 60 // default to 1 hour
): Promise<T> {
  const cachedValue = await myRedis.get(key)
  if (cachedValue) {
    return JSON.parse(cachedValue) as T
  }

  const result = await run()

  await myRedis.set(key, JSON.stringify(result), "EX", ttlSeconds)

  return result
}
