import type { AppRouter } from "@ts-rest/core"
import type { createExpressEndpoints } from "@ts-rest/express"

// @ts-rest/express doesn't export this type from its package entry
export type RouterImplementation<T extends AppRouter> = Parameters<
  typeof createExpressEndpoints<T>
>[1]
