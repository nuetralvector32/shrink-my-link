import { KVNamespace } from '@cloudflare/workers-types';

declare global {
 namespace App {
  interface Platform {
   env?: {
    LINKS: KVNamespace;
   };
  }
 }
}
export {};