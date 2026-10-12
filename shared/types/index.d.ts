import 'pinia'

declare module 'pinia' {
  interface DefineStoreOptionsBase<S, Store> {
    persist?: { pick: string[] }
  }
}
