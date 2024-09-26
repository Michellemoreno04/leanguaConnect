/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_APP_TITLE: string
    
    
    // Agrega aquí otras variables de entorno que uses
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }