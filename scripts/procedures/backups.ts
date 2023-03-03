import { Backups } from "start-sdk/backup/index";

export const { createBackup, restoreBackup } = Backups.volumes("main").build();
