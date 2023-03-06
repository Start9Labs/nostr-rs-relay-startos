import { healthUtil, Types as T } from "start-sdk";
import healthRunner from "start-sdk/health/healthRunner";

export default healthRunner(
  "Relay Available",
  healthUtil.checkWebUrl("http://nostr.embassy:8080"),
  { defaultIntervalS: 60 }
);
