import "dotenv/config";
import express from "express";

import { authRouter, purchaseRouter, vehicleRouter } from "#/routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cors from "cors";

const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/purchases", purchaseRouter);
app.use(errorMiddleware);

export default app;
