import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_10_0_1 } from './v0.10.0_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_10_0_1],
})
