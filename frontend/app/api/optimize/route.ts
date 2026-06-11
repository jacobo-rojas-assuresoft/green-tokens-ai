import { NextResponse } from "next/server";

// Best Practice: Use environment variables for external URLs and keys
const API_URL =
  process.env.OPTIMIZE_API_URL ||
  "https://green-tokens-ai.onrender.com/optimize";
const API_TIMEOUT_MS = 15000; // 15 seconds timeout

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: 'A valid "prompt" string is required in the request body.' },
        { status: 400 },
      );
    }

    // 1. Setup Timeout Handling using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    let externalResponse;
    try {
      // 2. Call the External API
      externalResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment and set your API key in .env.local if required:
          // 'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal, // Pass the signal to fetch
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Handle Timeout specifically
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          {
            error:
              "The optimization service took too long to respond. Please try again.",
          },
          { status: 504 }, // 504 Gateway Timeout
        );
      }

      // Handle Network/Connection Errors (e.g., DNS failure, refused connection)
      return NextResponse.json(
        {
          error:
            "Unable to connect to the optimization service. Check your network or the service status.",
        },
        { status: 502 }, // 502 Bad Gateway
      );
    }

    clearTimeout(timeoutId);

    // 3. Handle External API HTTP Errors (e.g., 400, 401, 500)
    if (!externalResponse.ok) {
      let errorMessage = "The external service returned an error.";
      try {
        // Try to parse the error message from the external API's response
        const errorData = await externalResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors if the external API didn't return JSON
      }

      return NextResponse.json(
        { error: `Optimization failed: ${errorMessage}` },
        { status: 502 },
      );
    }

    // 4. Parse and Map the Successful Response
    const data = await externalResponse.json();

    // Map the external API response to our standardized format
    // Supports both the new format (optimizedPrompt, tokensBefore, tokensAfter, greenScore, improvement)
    // and fallback to legacy formats
    const optimizedText =
      data.optimizedPrompt ||
      data.optimized_text ||
      data.optimizedText ||
      data.result ||
      "";
    const inputTokens =
      data.tokensBefore ||
      data.input_tokens ||
      data.inputTokens ||
      Math.ceil(prompt.split(/\s+/).length * 1.3);
    const outputTokens =
      data.tokensAfter ||
      data.output_tokens ||
      data.outputTokens ||
      Math.ceil(optimizedText.split(/\s+/).length * 1.3);
    const greenScore = data.greenScore || null;
    const improvement = data.improvement || null;

    return NextResponse.json({
      optimizedText,
      inputTokens,
      outputTokens,
      ...(greenScore !== null && { greenScore }),
      ...(improvement !== null && { improvement }),
    });
  } catch (error) {
    console.error("Internal API Route Error:", error);
    return NextResponse.json(
      { error: "An unexpected internal server error occurred." },
      { status: 500 },
    );
  }
}
