import express from "express";
import cors from "cors";
import { authenticate } from "./middleware/auth.js";
import router from "./routes/version.js";
import documentDeleteRouter from "./routes/deleteDocument.js";

export const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// attaching auth middleware to all routes starting with /api
app.use("/api",authenticate);

app.use("/api",router)
app.use("/api",documentDeleteRouter);