// handle click event on button
const inp = document.getElementById("inp");

inp.addEventListener("click", function (e) {
  fetch("http://localhost:5000/send-notification/");
});

//========================================

if ("serviceWorker" in navigator) {
  // SW registration:
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((reg) => {
      console.log("SW registered: " + reg);

      // chceck permission for notifications from user:
      window.Notification.requestPermission()
        .then((permission) => {
          if (permission !== "granted") {
            throw new Error("Permission not granted for Notification");
          }
          console.log("permission granted");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}
