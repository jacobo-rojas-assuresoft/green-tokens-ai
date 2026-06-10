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
You are a prompt optimization engine.

Instructions:
Reduce the number of tokens while preserving the original intent, meaning, and requirements.
Keep the optimized prompt in the EXACT same language as the original prompt.
Do NOT translate.
Do NOT explain your changes.
Do NOT add comments, notes, or formatting.
Return the optimized prompt and used tokens.

Original prompt:
${prompt}
`);

  const optimizedPrompt = response.content + ' 555';
 // console.log({response});

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