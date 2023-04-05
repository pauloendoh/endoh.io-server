import { myConsoleError } from "./myConsoleError"

export const myEnvs = {}

function envToStringOrThrow(env: string | undefined): string {
  if (env === undefined) {
    const message = `Variable '${env}' is undefined.`
    myConsoleError(message)
    throw new Error(message)
  }
  return env
}
