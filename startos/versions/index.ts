import { VersionGraph } from '@start9labs/start-sdk'
import { v_0_9_0_5 } from './v0.9.0.5'
import { v_0_9_0_6 } from './v0.9.0.6'

export const versionGraph = VersionGraph.of({
  current: v_0_9_0_6,
  other: [v_0_9_0_5],
})
