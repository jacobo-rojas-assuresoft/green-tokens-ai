import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { optimizePrompt } from "./services/greenTokensService.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "greenTokens Backend is running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "Ok",
    timestamp: new Date().toISOString()
  });
});

app.post("/optimize", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "prompt is required",
      });
    }

    const result = await optimizePrompt(prompt);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "internal server error",
    });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});