import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { configToml } from '../../fileModels/config.toml'
import { configDefaults } from '../../utils'

export const v_0_9_0_3_b0 = VersionInfo.of({
  version: '0.9.0:3-beta.0',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.55',
    es_ES: 'Actualización a StartOS SDK beta.55',
    de_DE: 'Update auf StartOS SDK beta.55',
    pl_PL: 'Aktualizacja do StartOS SDK beta.55',
    fr_FR: 'Mise à jour vers StartOS SDK beta.55',
  },
  migrations: {
    up: async ({ effects }) => {
      const mainVol = '/media/startos/volumes/main'

      // get old config.yaml
      const configYaml:
        | {
            'relay-type': {
              type: 'private' | 'public'
              pubkey_whitelist: string[]
              info: {}
              limits: {
                event_kind_blacklist: string[]
              }
            }
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        // srv
        await new Promise((res, rej) => {
          execFile(
            'sh',
            ['-c', `mv ${mainVol}/data/* /media/startos/volumes/db`],
            (err) => (err ? rej(err) : res(null)),
          )
        }).catch(console.error)

        const old =
          configYaml['relay-type'].type === 'private'
            ? {
                authorization: {
                  pubkey_whitelist: configYaml['relay-type'].pubkey_whitelist,
                },
              }
            : {
                info: configYaml['relay-type'].info,
                limits: {
                  ...configYaml['relay-type'].limits,
                  event_kind_blacklist:
                    configYaml['relay-type'].limits.event_kind_blacklist.map(
                      Number,
                    ),
                },
              }

        await configToml.write(effects, { ...configDefaults, ...old })

        // clear old main vol
        const entries = await readdir(mainVol)
        await Promise.all(
          entries.map((entry) =>
            rm(join(mainVol, entry), { recursive: true }).catch(console.error),
          ),
        )
      }
    },
    down: IMPOSSIBLE,
  },
})
