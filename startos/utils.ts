import { sdk } from './sdk'

export const clnMountpoint = '/mnt/cln'
export const lnbitsMountpoint = '/mnt/lnbits'

export const relayInterfacePort = 8080
export const relayInterfaceId = 'relay'

export function nullToUndefined(value: any) {
  return value ?? undefined
}

export const mainMount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: '/data',
  readonly: false,
})
