import { sdk } from '../sdk'
import { configureInfo } from './configure/info'
import { configureEvents } from './configure/events'
import { configureRestrict } from './configure/restrict'
import { configureLimits } from './configure/limits'
import { configurePayments } from './configure/payments'

export const actions = sdk.Actions.of()
  .addAction(configureInfo)
  .addAction(configureEvents)
  .addAction(configureRestrict)
  .addAction(configureLimits)
  .addAction(configurePayments)
