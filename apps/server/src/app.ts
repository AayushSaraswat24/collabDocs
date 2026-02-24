import express from "express";
import cors from "cors";
import { authenticate } from "./middleware/auth";
import router from "./routes/version";

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

app.use("/api",authenticate,router)