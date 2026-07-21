import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { configToml } from '../fileModels/config.toml'

export const v_0_10_0_1 = VersionInfo.of({
  version: '0.10.0:1',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 2.0.x)',
    es_ES: 'Actualizaciones internas (start-sdk 2.0.x)',
    de_DE: 'Interne Aktualisierungen (start-sdk 2.0.x)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 2.0.x)',
    fr_FR: 'Mises à jour internes (start-sdk 2.0.x)',
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
        const relayType = configYaml['relay-type']

        // srv
        await new Promise((res, rej) => {
          execFile(
            'sh',
            ['-c', `mv ${mainVol}/data/* /media/startos/volumes/db`],
            (err) => (err ? rej(err) : res(null)),
          )
        }).catch(console.error)

        const old = relayType
          ? relayType.type === 'private'
            ? {
                authorization: {
                  pubkey_whitelist: relayType.pubkey_whitelist,
                },
              }
            : {
                info: relayType.info,
                limits: {
                  ...relayType.limits,
                  event_kind_blacklist:
                    relayType.limits?.event_kind_blacklist?.map(Number) ?? [],
                },
              }
          : {}

        await configToml.merge(effects, old)

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
