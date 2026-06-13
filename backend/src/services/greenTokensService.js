import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { countTokens } from "../utils/tokenCounter.js";
import { calculateGreenScore } from "../utils/greenScoreCalculator.js";

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
You are a prompt optimization engine.

Instructions:
Reduce the number of tokens while preserving the original intent, meaning, and requirements.
Keep the optimized prompt in the EXACT same language as the original prompt.
Do NOT translate.
Do NOT explain your changes.
Do NOT add comments, notes, or formatting.
Return ONLY the optimized prompt.

Original prompt:
${prompt}
`);

  const optimizedPrompt = response.content;
 // console.log({response});

  const tokensBefore = countTokens(prompt);
  const tokensAfter = countTokens(optimizedPrompt);
  const tokensSaved = tokensBefore - tokensAfter;
  const improvementPercentage = tokensBefore > 0 ? Number(((tokensSaved / tokensBefore) * 100).toFixed(2)) : 0;

  const greenScore = calculateGreenScore( improvementPercentage, tokensSaved);


  //TODO: Insert data in database for history
  return {
    originalPrompt: prompt,
    optimizedPrompt,
    greenScore,
    tokensBefore,
    tokensAfter,
    tokensSaved,
    improvementPercentage,
    
  };
}