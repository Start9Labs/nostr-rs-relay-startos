import { setupMigrations } from 'start-sdk/lib/inits/migrations/setupMigrations'
import { manifest } from '../../manifest'

/**
 * Add each new migration as the next argument to this function
 */
export const migrations = setupMigrations(manifest)
