import "dotenv/config";
import express from "express";

import { authRouter, purchaseRouter, vehicleRouter } from "#/routes";
import { errorMiddleware } from "./middleware/error.middleware";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/purchases", purchaseRouter);
app.use(errorMiddleware);

export default app;
