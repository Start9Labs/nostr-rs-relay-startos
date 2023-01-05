import { types as T, healthUtil } from "../deps.ts";

export const health: T.ExpectedExports.health = {
  "main": healthUtil.checkWebUrl("http://nostr.embassy:8080")
}
