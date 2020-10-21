console.log("service worker!");

//public key, ktory bude na back-ende vygenerovany cez webpush.generateVAPIDKeys():
const vapidPublicKey = "BGOEJ3Rf9--QkRRZqx9bQP2WQhs-VPmMvg-mIgtvMl8vLa2l7eemlw3PUwgJMyWyy1S86TA7sxf7VKfyMrI0_A8";

const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

// handle activate event
self.addEventListener("activate", (event) => {
  // This will be called only once when the service worker is activated.
  console.log("service worker activate");

  // subscribe to push service (firebase) and send subscription to backend
  self.registration.pushManager
    .subscribe({
      userVisibleOnly: true, //always disply notifications
      applicationServerKey: convertedVapidKey,
    })
    .then((subscription) => {
      console.log(JSON.stringify(subscription));
      fetch("http://localhost:5000/subscribe/", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// handle push event (when push notification send to frontend via push service)
self.addEventListener("push", (event) => {
  if (event.data) {
    console.log("push event! ", event.data.text());

    const data = event.data.json();

    const { title } = data;

    const body = {
      body: data.body,
      icon: data.icon,
    };
    // show push notification (from backend via SW to users browser)
    event.waitUntil(self.registration.showNotification(title, body));
  } else {
    console.log("push event, but no data");
  }
  //tuto asi pichnem:  window.location.href = "/";
  //a bude treba asi aj: self.skipWaiting(); - urobi novy SW aktivny a tak uz budu uzivatelia vidiet novu verziu
  //a mozno aj self.unregister()
});

//==================================================

// function for encode base64 public key to Array buffer which is needed by the subscription option
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
