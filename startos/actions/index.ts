import { sdk } from '../sdk'
import { configureInfo } from './info'
import { configureEvents } from './events'
import { configureRestrict } from './restrict'
import { configureLimits } from './limits'

export const actions = sdk.Actions.of()
  .addAction(configureInfo)
  .addAction(configureEvents)
  .addAction(configureRestrict)
  .addAction(configureLimits)
