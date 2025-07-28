// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCQP1_hEAK_T9_3DadchRxLZDriuKjxbXw",
  authDomain: "track2crack-f70f0.firebaseapp.com",
  projectId: "track2crack-f70f0",
  storageBucket: "track2crack-f70f0.appspot.com",  
  messagingSenderId: "1028130794191",
  appId: "1:1028130794191:web:2dab684527c5794c3725ba"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) { 

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
    data: payload.data, // optional — lets you redirect on click
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
