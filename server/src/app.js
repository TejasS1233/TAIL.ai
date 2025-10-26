import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { ExpressPeerServer } from "peer";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow same-origin or curl/postman
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
};

const isProd = process.env.NODE_ENV === "production";

const corsOptions = {
  origin: isProd
    ? function (origin, callback) {
        if (isOriginAllowed(origin)) {
          return callback(null, true);
        }
        return callback(new Error("CORS: Origin not allowed"));
      }
    : true, // reflect request origin in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

const io = new SocketIOServer(httpServer, { cors: corsOptions });

const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
});

app.set("io", io);

app.use(helmet());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

app.use(cors(corsOptions));
// Explicit preflight for Google OAuth endpoint
app.options("/api/v1/users/oauth/google", cors(corsOptions));

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/peerjs", peerServer);

import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import chatbotRoutes from "./routes/chat.routes.js";
import chatRouter from "./routes/chat.routes.js";

import threadRouter from "./routes/thread.routes.js";
import scanRouter from "./routes/scan.js";
import devRouter from "./routes/dev.routes.js";
import mlProxyRouter from './routes/ml_proxy.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
// Backwards-compatible alias for older clients/scripts that request `/api/v1/health`
app.use("/api/v1/health", healthcheckRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1/chat", chatRouter);

app.use("/api/v1/threads", threadRouter);
app.use("/api/v1/scan", scanRouter);
app.use('/api/v1/dev', devRouter);
app.use('/api/v1/ml', mlProxyRouter);

io.on("connection", (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Socket.IO client disconnected: ${socket.id}`);
  });
});

export { httpServer };
