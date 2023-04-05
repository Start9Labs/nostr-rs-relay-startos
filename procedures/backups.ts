import { Backups } from "start-sdk/lib/backup";

export const { createBackup, restoreBackup } = Backups.volumes("main").build();