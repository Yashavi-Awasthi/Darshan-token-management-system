/* =====================================================
   Firebase Core — firebase.js
   Darshan App (Hackathon-Ready)
   Firebase v8 | Vanilla JS
   ===================================================== */

console.log("🔥 Loading firebase.js");

/* ================= FIREBASE CONFIG ================= */
var firebaseConfig = {
  apiKey: "AIzaSyBeTQdKmRH788wMrQh4x-IkEt6lt4_rd4E",
  authDomain: "darshan-app-48a19.firebaseapp.com",
  databaseURL: "https://darshan-app-48a19-default-rtdb.firebaseio.com",
  projectId: "darshan-app-48a19",
  storageBucket: "darshan-app-48a19.appspot.com",
  messagingSenderId: "1036337719358",
  appId: "1:1036337719358:web:edabaf639a8cabfccb896f"
};

/* ================= SAFE INIT ================= */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

/* ================= DATABASE ================= */
var db = firebase.database();

/* ================= CONNECTION CHECK ================= */
db.ref(".info/connected").on("value", snap => {
  if (snap.val() === true) {
    console.log("✅ Firebase connected");
  } else {
    console.warn("⚠️ Firebase disconnected");
  }
});

/* =====================================================
   READ-ONLY HELPERS (SAFE)
   ===================================================== */

/* ---------- Mandirs ---------- */
function getAllMandirs(callback) {
  db.ref("mandirs").once("value")
    .then(snap => callback(snap.val() || {}))
    .catch(err => console.error(err));
}

function getMandir(templeId, callback) {
  db.ref("mandirs/" + templeId).once("value")
    .then(snap => callback(snap.val()))
    .catch(err => console.error(err));
}

/* ---------- Admins ---------- */
function getAdminById(adminId, callback) {
  db.ref("admins/" + adminId).once("value")
    .then(snap => callback(snap.exists() ? snap.val() : null))
    .catch(err => console.error(err));
}

/* ---------- Batch Settings ---------- */
function getBatchSettings(templeId, callback) {
  db.ref("batchSettings/" + templeId).once("value")
    .then(snap => callback(snap.val()))
    .catch(err => console.error(err));
}

/* ---------- Tokens (READ ONLY) ---------- */
function getCurrentToken(templeId, callback) {
  db.ref("currentToken/" + templeId).once("value")
    .then(snap => callback(snap.val() || 0))
    .catch(err => console.error(err));
}

function isTokenUsed(templeId, token, callback) {
  db.ref(`usedTokens/${templeId}/${token}`).once("value")
    .then(snap => callback(snap.exists()))
    .catch(err => console.error(err));
}

/* =====================================================
   UTILITIES
   ===================================================== */

function nowTs() {
  return Date.now();
}

function log(msg) {
  console.log("🛕 Darshan:", msg);
}

/* ===================================================== */
console.log("✅ firebase.js ready (clean, safe, dynamic)");

