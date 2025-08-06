export function myConsoleError(...params: Parameters<typeof console.log>) {
  console.log("❌", params)

  return
}

export function myConsoleErrorV2(
  namedObject: { name: string },
  ...params: Parameters<typeof console.log>
) {
  console.log(`❌ [${namedObject.name}] `, params)

  return
}
