declare var self: ServiceWorkerGlobalScope;
export {};

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { Plugin as BackgroundSyncPlugin } from 'workbox-background-sync';
import { NetworkFirst } from 'workbox-strategies';

interface ServiceWorkerGlobalScope {
  __precacheManifest?: any[];
}

importScripts(
  'PRECACHE_MANIFEST', // This gets injected during build time
);

// Precaching
self.__precacheManifest = [].concat(self.__precacheManifest || []);
precacheAndRoute(self.__precacheManifest, {});

// Background sync
const bgSyncPlugin = new BackgroundSyncPlugin('ApiRequests');

registerRoute(
  /\/api\/.*/,
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  'POST',
);
