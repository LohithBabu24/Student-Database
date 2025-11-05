/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  // add more env vars here if you use them later
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
