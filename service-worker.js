console.log("service worker!");

self.addEventListener("activate", event => {
  // This will be called only once when the service worker is activated.
  console.log("service worker activate");

  self.registration.pushManager
    .subscribe({
      userVisibleOnly: true //always disply notifications
    })
    .then(subscription => {
      console.log(JSON.stringify(subscription));
    })
    .catch(err => {
      console.log(err);
    });
});
