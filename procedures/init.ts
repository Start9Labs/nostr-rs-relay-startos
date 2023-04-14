import { setupInit, noMigrationsUp, noActions, setupUninit, noMigrationsDown } from "start-sdk/lib/init";

export const init = setupInit(async () => {
  return [noMigrationsUp(), noActions()];
});

export const uninit = setupUninit(async () => {
  return [noMigrationsDown()];
});
