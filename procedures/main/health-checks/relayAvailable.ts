import { healthUtil } from "start-sdk";
import healthRunner from "start-sdk/lib/health/healthRunner";

export default healthRunner(
  "Relay Available",
  healthUtil.checkWebUrl("http://nostr.embassy:8080"),
);
