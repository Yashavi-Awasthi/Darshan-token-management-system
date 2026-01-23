const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Triggered whenever exit admin moves to next batch
 * Sends push notification to the NEXT batch (10 min warning)
 */
exports.notifyUpcomingBatch = functions.database
  .ref("/currentToken/{temple}")
  .onUpdate(async (change, context) => {

    const temple = context.params.temple;
    const newCurrentToken = change.after.val();

    // Load batch settings
    const batchSnap = await admin.database()
      .ref(`batchSettings/${temple}`)
      .once("value");

    if (!batchSnap.exists()) return null;

    const { peoplePerBatch } = batchSnap.val();

    // Tokens that are NEXT batch (10 min warning)
    const notifyStart = newCurrentToken + 1;
    const notifyEnd   = newCurrentToken + peoplePerBatch;

    const tokenSnap = await admin.database()
      .ref(`fcmTokens/${temple}`)
      .once("value");

    if (!tokenSnap.exists()) return null;

    const tokenMap = tokenSnap.val();
    let messages = [];

    for (let token = notifyStart; token <= notifyEnd; token++) {
      if (tokenMap[token]?.fcmToken) {
        messages.push({
          token: tokenMap[token].fcmToken,
          notification: {
            title: "🛕 Darshan Update",
            body: "Your batch is coming in 10 minutes"
          },
          data: {
            temple: temple,
            tokenNumber: String(token)
          }
        });
      }
    }

    if (messages.length > 0) {
      await admin.messaging().sendAll(messages);
      console.log(`Sent ${messages.length} notifications for ${temple}`);
    }

    return null;
  });

