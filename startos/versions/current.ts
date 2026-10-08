import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.0:6',
  releaseNotes: {
    en_US: `This release migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later). nostr-rs-relay itself is unchanged (0.10.0).

- Permitted Events and Restrict Access describe what each of their options does.
- Set Data Limits says what leaving each limit blank does.
- General Information describes what the External Address is for.`,
    es_ES: `Esta versión migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior). nostr-rs-relay no cambia (0.10.0).

- Eventos permitidos y Restringir acceso describen qué hace cada una de sus opciones.
- Establecer límites de datos indica qué ocurre si dejas vacío cada límite.
- Información general describe para qué sirve la Dirección externa.`,
    de_DE: `Diese Version stellt das Paket auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer). nostr-rs-relay selbst ist unverändert (0.10.0).

- „Erlaubte Ereignisse“ und „Zugang einschränken“ beschreiben, was jede ihrer Optionen bewirkt.
- „Datenlimits festlegen“ gibt an, was ein leer gelassenes Limit bewirkt.
- „Allgemeine Informationen“ beschreibt, wofür die Externe Adresse dient.`,
    pl_PL: `Ta wersja przenosi pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego). nostr-rs-relay pozostaje bez zmian (0.10.0).

- „Dozwolone wydarzenia” i „Ogranicz dostęp” opisują, co robi każda z ich opcji.
- „Ustaw limity danych” wyjaśnia, co oznacza pozostawienie limitu pustym.
- „Informacje ogólne” opisują, do czego służy Adres zewnętrzny.`,
    fr_FR: `Cette version fait passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure). nostr-rs-relay lui-même est inchangé (0.10.0).

- Événements autorisés et Restreindre l'accès décrivent l'effet de chacune de leurs options.
- Définir les limites de données indique ce que signifie laisser une limite vide.
- Informations générales décrit à quoi sert l'Adresse externe.`,
  },
  migrations: {},
})
