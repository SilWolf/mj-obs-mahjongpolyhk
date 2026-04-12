/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ORGANIZATION: string
  readonly VITE_DATA_PROVIDER: string
  readonly VITE_UPLOAD_RESULT_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
