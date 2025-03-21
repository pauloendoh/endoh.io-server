import { myConsoleError } from "./myConsoleError"

export const myEnvs = {
  REDIS_URL: envToStringOrThrow(process.env.REDIS_URL),
  JWT_SECRET: envToStringOrThrow(process.env.JWT_SECRET),
  SENDGRID_API_KEY: envToStringOrThrow(process.env.SENDGRID_API_KEY),
  IS_DOCKER: envToBoolean("IS_DOCKER"),

  RIOT_API_KEY: envToStringOrThrow(process.env.RIOT_API_KEY),

  OPEN_AI_KEY: envToStringOrThrow(process.env.OPEN_AI_KEY),
}

function envToStringOrThrow(env: string | undefined): string {
  if (env === undefined) {
    const message = `Variable '${env}' is undefined.`
    myConsoleError(message)
    throw new Error(message)
  }
  return env
}

function envToBoolean(key: string): boolean {
  const value = process.env[key]
  if (value === undefined) {
    return false
  }

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  const message = `Variable '${key}' is not a boolean.`
  myConsoleError(message)
  throw new Error(message)
}
