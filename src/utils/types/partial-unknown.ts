// partial, where you get the  key names, but the value types are unknown.

export type PartialUnknown<T> = {
  [K in keyof T]?: unknown
}
