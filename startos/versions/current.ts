import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { configToml } from '../fileModels/config.toml'

export const current = VersionInfo.of({
  version: '0.10.0:0',
  releaseNotes: {
    en_US:
      'Updates Nostr RS Relay to 0.10.0 (NIP-91 tag queries, dependency and stability fixes). The relay is now built from source rather than a third-party Docker image, so future releases can track upstream directly.',
    es_ES:
      'Actualiza Nostr RS Relay a 0.10.0 (consultas por etiqueta NIP-91, actualizaciones de dependencias y correcciones de estabilidad). El relay ahora se compila desde el código fuente en lugar de una imagen de terceros, para poder seguir las versiones upstream directamente.',
    de_DE:
      'Aktualisiert Nostr RS Relay auf 0.10.0 (NIP-91-Tag-Abfragen, Abhängigkeits- und Stabilitätskorrekturen). Das Relay wird jetzt aus dem Quellcode gebaut statt aus einem Drittanbieter-Image, sodass künftige Versionen direkt dem Upstream folgen können.',
    pl_PL:
      'Aktualizuje Nostr RS Relay do 0.10.0 (zapytania po tagach NIP-91, aktualizacje zależności i poprawki stabilności). Relay jest teraz budowany ze źródeł zamiast obrazu od osób trzecich, dzięki czemu kolejne wydania mogą śledzić upstream bezpośrednio.',
    fr_FR:
      "Met à jour Nostr RS Relay vers 0.10.0 (requêtes par tag NIP-91, mises à jour des dépendances et corrections de stabilité). Le relay est désormais compilé depuis les sources plutôt qu'à partir d'une image tierce, afin que les futures versions puissent suivre l'upstream directement.",
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
