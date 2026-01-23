// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBeTQdKmRH788wMrQh4x-IkEt6lt4_rd4E",
  authDomain: "darshan-app-48a19.firebaseapp.com",
  projectId: "darshan-app-48a19",
  storageBucket: "darshan-app-48a19.appspot.com",
  messagingSenderId: "1036337719358",
  appId: "1:1036337719358:web:edabaf639a8cabfccb896f",
  databaseURL: "https://darshan-app-48a19-default-rtdb.firebaseio.com"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

