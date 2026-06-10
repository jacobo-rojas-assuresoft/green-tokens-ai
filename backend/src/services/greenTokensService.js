import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const llm = new ChatOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
  model: "llama-3.3-70b-versatile",
});

export async function optimizePrompt(prompt) {
  const response = await llm.invoke(`
Optimiza este prompt reduciendo tokens sin perder intención.

Devuelve únicamente el prompt optimizado respetndo el lenguaje del prompt original.

Prompt:
${prompt}
`);

  const optimizedPrompt = response.content;

  const tokensBefore = Math.ceil(prompt.length / 4);
  const tokensAfter = Math.ceil(optimizedPrompt.length / 4);

  //TODO: calculate green score
  //TODO: calculate improvement
  //TODO: Insert data in database for history
  return {
    originalPrompt: prompt,
    optimizedPrompt,
    greenScore: Math.floor(Math.random() * 30 + 70),
    tokensBefore,
    tokensAfter,
    improvement:
      (
        ((tokensBefore - tokensAfter) / tokensBefore) *
        100
      ).toFixed(2) + "%",
  };
}