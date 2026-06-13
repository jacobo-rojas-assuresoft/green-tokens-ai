import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { countTokens } from "../utils/tokenCounter.js";
import { calculateGreenScore } from "../utils/greenScoreCalculator.js";
import { calculateImpact } from "../utils/impactCalculator.js";
import { round } from "../utils/numberUtils.js";

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

  const impactBefore = calculateImpact(tokensBefore);
  const impactAfter = calculateImpact(tokensAfter);

  const electricitySaved = impactBefore.electricity - impactAfter.electricity;
  const waterSaved =  impactBefore.water - impactAfter.water;
  const co2Saved = impactBefore.co2 - impactAfter.co2;
  const costSaved = impactBefore.cost - impactAfter.cost;

  //TODO: Insert data in database for history
return {
  originalPrompt: prompt,
  optimizedPrompt,
  greenScore,
  tokensBefore,
  tokensAfter,
  tokensSaved,
  improvementPercentage,

  electricityBefore: round( impactBefore.electricity, 6),
  electricityAfter:  round( impactAfter.electricity, 6),
  electricitySaved: round(electricitySaved, 6),
  waterBefore: round( impactBefore.water, 8),
  waterAfter:  round( impactAfter.water,8),
  waterSaved: round(waterSaved, 8),
  co2Before: round( impactBefore.co2, 8),
  co2After:  round( impactAfter.co2, 8),
  co2Saved: round(co2Saved, 8),
  costBefore: round( impactBefore.cost, 6),
  costAfter:  round( impactAfter.cost, 6),
  costSaved: round(costSaved, 6),
};

}