if ("serviceWorker" in navigator) {
  // SW registration:
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(reg => {
      console.log("SW registered: " + reg);

      // chceck permission for notifications from user:
      window.Notification.requestPermission()
        .then(permission => {
          if (permission !== "granted") {
            throw new Error("Permission not granted for Notification");
          }
          console.log("permission granted");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}
