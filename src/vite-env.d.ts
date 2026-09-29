/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCK_LOGIN: string;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
