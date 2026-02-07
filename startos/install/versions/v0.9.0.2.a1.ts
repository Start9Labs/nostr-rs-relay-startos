import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { configToml } from '../../fileModels/config.toml'
import { configDefaults } from '../../utils'
import { i18n } from '../../i18n'

export const v_0_9_0_2_a1 = VersionInfo.of({
  version: '0.9.0:2-alpha.1',
  releaseNotes: {
    en_US: 'Revamped for StartOS 0.4.0',
    es_ES: 'Renovado para StartOS 0.4.0',
    de_DE: 'Überarbeitet für StartOS 0.4.0',
    pl_PL: 'Przeprojektowany dla StartOS 0.4.0',
    fr_FR: 'Refait pour StartOS 0.4.0',
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
