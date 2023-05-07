import { setupMigrations } from '@start9labs/start-sdk/lib/inits/migrations/setupMigrations'
import { manifest } from '../../manifest'
import { v0_8_9 } from './v0_8_9'

/**
 * Add each new migration as the next argument to this function
 */
export const migrations = setupMigrations(manifest, v0_8_9)
