import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.0:5',
  releaseNotes: {
    en_US: `This release migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later). nostr-rs-relay itself is unchanged (0.10.0).`,
    es_ES: `Esta versión migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior). nostr-rs-relay no cambia (0.10.0).`,
    de_DE: `Diese Version stellt das Paket auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer). nostr-rs-relay selbst ist unverändert (0.10.0).`,
    pl_PL: `Ta wersja przenosi pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego). nostr-rs-relay pozostaje bez zmian (0.10.0).`,
    fr_FR: `Cette version fait passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure). nostr-rs-relay lui-même est inchangé (0.10.0).`,
  },
  migrations: {},
})
