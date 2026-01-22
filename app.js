/* =====================================================
   Darshan App — app.js
   Shared Utilities (User + Display)
   Firebase v8 | Vanilla JS
   ===================================================== */

console.log("✅ app.js loaded");

/* ================= FIREBASE INIT ================= */
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBeTQdKmRH788wMrQh4x-IkEt6lt4_rd4E",
    authDomain: "darshan-app-48a19.firebaseapp.com",
    databaseURL: "https://darshan-app-48a19-default-rtdb.firebaseio.com",
    projectId: "darshan-app-48a19",
    messagingSenderId: "1036337719358",
    appId: "1:1036337719358:web:edabaf639a8cabfccb896f"
  });
}

const db = firebase.database();

/* ================= CONSTANTS ================= */
const LOCATION_RADIUS_KM = 3;

/* ================= URL HELPER ================= */
function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ================= DISTANCE HELPER ================= */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ================= LOCATION CHECK ================= */
function verifyUserLocation(templeId, onSuccess, onFail) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  db.ref("mandirs/" + templeId).once("value").then(snap => {
    if (!snap.exists()) {
      alert("Invalid Mandir");
      return;
    }

    const { lat, lng } = snap.val();

    navigator.geolocation.getCurrentPosition(
      pos => {
        const distance = getDistanceKm(
          pos.coords.latitude,
          pos.coords.longitude,
          lat,
          lng
        );

        console.log("📍 Distance:", distance.toFixed(2), "km");

        if (distance <= LOCATION_RADIUS_KM) {
          onSuccess(distance);
        } else {
          onFail(distance);
        }
      },
      () => alert("Please allow location access")
    );
  });
}

/* ================= LOAD MANDIR DROPDOWN ================= */
function loadMandirDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  db.ref("mandirs").once("value").then(snap => {
    select.innerHTML = `<option value="">-- Select Mandir --</option>`;

    snap.forEach(child => {
      const id = child.key;
      const m  = child.val();

      const opt = document.createElement("option");
      opt.value = id;
      opt.innerText = m.mandirName;
      select.appendChild(opt);
    });
  });
}

/* ================= FORMATTERS ================= */
function formatTime(minutes) {
  if (!minutes) return "0 min";
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

function now() {
  return new Date().toLocaleTimeString();
}

/* ================= SAFE LOGGER ================= */
function log(msg) {
  console.log("🛕 Darshan:", msg);
}

/* ================= END ================= */
console.log("✅ app.js fully integrated with dynamic mandir system");
