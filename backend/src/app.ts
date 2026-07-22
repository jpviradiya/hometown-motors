import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Car Dealership API is running 🚗",
  });
});

export default app;
