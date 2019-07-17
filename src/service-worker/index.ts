declare var self: ServiceWorkerGlobalScope;
export {};

console.log(self);

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    console.log;
  }
});
