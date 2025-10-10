// services/notification.service.js

import admin from "firebase-admin";

export async function sendPushNotification(token, title, body) {
  if (!token) {
    console.log("Attempted to send notification, but user has no FCM token.");
    return;
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
    android: {
      priority: "high", // This is the key to bypassing Doze Mode
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
    // Here you can add logic to handle invalid tokens,
    // for example, by removing the token from your database.
  }
}
