/* ===================================================== 
   Darshan App — app.js
   Shared Utilities (Devotee / Display / Admin)
   Firebase v8 | Vanilla JS
   ===================================================== */

console.log("🛕 app.js loaded");

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
const LOCATION_RADIUS_KM = 5; // must match devotee.html UI

/* ================= USER SESSION ================= */
const USER_ID =
  localStorage.getItem("darshanUserId") ||
  ("U-" + Date.now() + Math.floor(Math.random() * 1000));

localStorage.setItem("darshanUserId", USER_ID);

/* ================= URL HELPER ================= */
function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ================= DISTANCE CALC ================= */
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

/* ================= LOCATION VERIFICATION ================= */
function verifyUserLocation(templeId, onSuccess, onFail) {
  if (!navigator.geolocation) {
    alert("❌ Geolocation not supported by browser");
    return;
  }

  db.ref("mandirs/" + templeId).once("value").then(snap => {
    if (!snap.exists()) {
      alert("❌ Invalid Mandir selected");
      return;
    }

    const loc = snap.val().location || snap.val();
    const { lat, lng } = loc;

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
      () => alert("❌ Please allow location access")
    );
  });
}

/* ================= LOAD MANDIR DROPDOWN ================= */
function loadMandirDropdown(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="">Loading Mandirs…</option>`;

  db.ref("mandirs").once("value").then(snap => {
    select.innerHTML = `<option value="">-- Select Mandir --</option>`;

    snap.forEach(child => {
      const m = child.val();
      if (!m) return;

      const opt = document.createElement("option");
      opt.value = child.key;
      opt.innerText = m.mandirName || m.name || "Unnamed Mandir";
      select.appendChild(opt);
    });
  });
}

/* ================= TOKEN HELPERS ================= */
function getUserTokenRef(templeId) {
  return db.ref(`userTokens/${USER_ID}/${templeId}`);
}

function clearUserToken(templeId) {
  return getUserTokenRef(templeId).remove();
}

/* ================= TIME FORMATTERS ================= */
function formatMinutes(mins) {
  if (!mins || mins <= 0) return "0 min";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)} hr ${mins % 60} min`;
}

function nowTime() {
  return new Date().toLocaleTimeString();
}

/* ================= SAFE LOGGER ================= */
function log(msg) {
  console.log("🛕 Darshan:", msg);
}

/* ================= EXPORT TO WINDOW ================= */
window.DarshanApp = {
  db,
  USER_ID,
  verifyUserLocation,
  loadMandirDropdown,
  formatMinutes,
  clearUserToken,
  getUserTokenRef,
  log
};

console.log("✅ app.js ready | Main portal = index.html | Booking = devotee.html");

