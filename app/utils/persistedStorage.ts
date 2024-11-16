import type { PublicRuntimeConfig } from '@nuxt/schema'
import type { PiniaPluginContext } from 'pinia'
import { useCookie } from '#app'
import type { StorageLike } from 'pinia-plugin-persistedstate'

type CookiesStorageOptions = PublicRuntimeConfig['piniaPluginPersistedstate']['cookieOptions']

/**
 * Cookie-based storage. Cookie options can be passed as parameter.
 * Uses Nuxt's `useCookie` under the hood.
 */
function cookies(options: CookiesStorageOptions = {}): StorageLike {
  return {
    getItem: key => useCookie<string | null>(
      key,
      {
        ...options,
        decode: decodeURIComponent,
        readonly: true,
      },
    ).value,
    setItem: (key, value) => useCookie<string>(
      key,
      {
        ...options,
        encode: encodeURIComponent,
      },
    ).value = value,
  }
}

export function optInCookies(options: CookiesStorageOptions = {}): StorageLike {
  const cookieStorage = cookies(options)
  return {
    getItem: (key) => {
      const shouldPersist = useState('shouldPersist')
      if (shouldPersist.value) {
        return cookieStorage.getItem(key)
      } else {
        return null
      }
    },
    setItem: (key, value) => {
      const shouldPersist = useState('shouldPersist')
      if (shouldPersist.value) {
        return cookieStorage.setItem(key, value)
      }
    }
  }
}

export function beforeHydrateClear(ctx: PiniaPluginContext) {
  const shouldPersist = useState('shouldPersist')
  if (!shouldPersist.value) {
    const cookie = useCookie(ctx.store.$id)
    cookie.value = null
  }
}
