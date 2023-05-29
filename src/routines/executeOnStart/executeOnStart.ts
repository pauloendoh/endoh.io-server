import { migrateFollowToV2 } from "./migrateFollowToV2/migrateFollowToV2"

export function executeOnStart() {
  migrateFollowToV2()
}
