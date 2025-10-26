import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { httpServer } from "./app.js";

// --- ADDED: Imports for 'fs' and 'firebase-admin' ---
import fs from "fs";
import admin from "firebase-admin";
// --- END OF ADDED IMPORTS ---

dotenv.config({ path: "./.env" });

// --- FIXED: The entire Firebase initialization block ---
try {
  // 1. Get the file path from your environment variable
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!serviceAccountPath) {
    console.log("⚠️ GOOGLE_APPLICATION_CREDENTIALS not set - skipping Firebase Admin SDK initialization.");
  } else {
    // 2. Read the file synchronously and parse it as a JSON object
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

    // 3. Initialize Firebase with the parsed object
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK initialized successfully.");
  }
} catch (error) {
  console.error("❌ Error initializing Firebase Admin SDK:", error);
}
// --- END OF FIX ---

connectDB()
  .then(() => {
  const port = process.env.PORT || 8002;
  console.log("Allowed CORS origins:", (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean));

    // Handle server errors (e.g., EADDRINUSE) to avoid unhandled exceptions
    httpServer.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Please stop the process using this port or set a different PORT in .env`);
        process.exit(1);
      } else {
        console.error('❌ HTTP server error:', err);
      }
    });

    httpServer.listen(port, () => {
      console.log(`🚀 Server running at: http://localhost:${port}/`);
      console.log(`❤️  Check health at: http://localhost:${port}/api/v1/healthcheck`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
