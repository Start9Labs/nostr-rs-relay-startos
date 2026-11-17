import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.10.0:8',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.2 or later. In Restrict Access, an empty Authorized Pubkeys list lets every pubkey publish (if you saved it empty, save it once more), the existing pubkey whitelist is kept, and verification intervals must be a number and a unit. Fixes memory use growing while the service runs.',
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. En Restringir acceso, una lista de Pubkeys autorizadas vacía permite publicar a cualquier pubkey (si la guardaste vacía, vuelve a guardarla), se conserva la lista blanca de pubkeys existente y los intervalos de verificación deben ser un número y una unidad. Corrige el aumento del uso de memoria mientras el servicio está en ejecución.',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. In „Zugang einschränken“ erlaubt eine leere Liste „Autorisierte Pubkeys“ jedem Pubkey das Veröffentlichen (wenn du sie leer gespeichert hast, speichere sie noch einmal), die vorhandene Pubkey-Whitelist bleibt erhalten, und Verifizierungsintervalle müssen eine Zahl und eine Einheit sein. Behebt einen während der Laufzeit des Dienstes ansteigenden Speicherverbrauch.',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. W akcji Ogranicz dostęp pusta lista Autoryzowane pubkeys pozwala publikować każdemu pubkey (jeśli zapisano ją pustą, zapisz ją ponownie), istniejąca biała lista pubkeys jest zachowywana, a odstępy weryfikacji muszą być liczbą z jednostką. Naprawia wzrost zużycia pamięci podczas działania usługi.',
    fr_FR:
      "Nécessite StartOS 0.4.2 ou une version ultérieure. Dans Restreindre l'accès, une liste Pubkeys autorisées vide permet à toutes les pubkeys de publier (si vous l'avez enregistrée vide, enregistrez-la à nouveau), la liste blanche de pubkeys existante est conservée et les intervalles de vérification doivent être un nombre suivi d'une unité. Corrige l'augmentation de la consommation de mémoire pendant le fonctionnement du service.",
  },
  migrations: {},
})
