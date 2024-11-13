import { sdk } from '../sdk'
import { configureEvents } from './configure/events'
import { configureInfo } from './configure/info'
import { configureLimits } from './configure/limits'
import { configurePayments } from './configure/payments'
import { configureRestrict } from './configure/restrict'

export const actions = sdk.Actions.of()
  .addAction(configureInfo)
  .addAction(configureLimits)
  .addAction(configureEvents)
  .addAction(configureRestrict)
  .addAction(configurePayments)
