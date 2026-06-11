"use client";

import { useState } from "react";
import styles from "./page.module.css";

// Helper: Count words
const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

// Helper: Estimate tokens (Rough heuristic: 1 word ≈ 1.3 tokens)
const estimateTokens = (text: string) => Math.ceil(countWords(text) * 1.3);

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for inline error banner

  // Calculate metrics dynamically
  const inputWords = countWords(inputText);
  const inputTokens = estimateTokens(inputText);
  const outputWords = countWords(outputText);
  const outputTokens = estimateTokens(outputText);

  // Calculate optimization percentage (reduction in tokens)
  const optimizationPercent =
    inputTokens > 0 && outputTokens > 0
      ? Math.max(0, ((inputTokens - outputTokens) / inputTokens) * 100).toFixed(
          1,
        )
      : "0.0";

  const handleOptimize = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter a prompt first.");
      return;
    }

    setIsLoading(true);
    setOutputText("");
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      // Parse the JSON body regardless of success or failure
      const data = await response.json();

      // If the response is not OK, throw the specific error message from the backend
      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      // Success: Update the UI
      setOutputText(data.optimizedText);
    } catch (error: any) {
      console.error("Error:", error);
      // Set the specific error message to display inline (e.g., "Timeout", "Unable to connect")
      setErrorMessage(error.message || "Failed to connect to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.appName}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--green-600)" }}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Green<span>Tokens</span> AI
          </h1>
          <div className={styles.teamInfo}>
            <span className={styles.badge}>Team: Green Coders</span>
            <span>
              👤 Bolivar Jimenez, Fabian Bustamente, Jacobo Rojas, Luhana
              Gonzalez
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Left Area: Input */}
          <div className={styles.section}>
            <label className={styles.label} htmlFor="input">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Input Prompt
            </label>
            <div className={styles.card}>
              <textarea
                id="input"
                className={styles.textarea}
                placeholder="Type or paste your text here to begin optimization..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className={styles.metrics}>
              <div className={styles.metricChip}>
                <span>Words:</span>
                <span className={styles.metricValue}>{inputWords}</span>
              </div>
              <div className={styles.metricChip}>
                <span>Tokens (est.):</span>
                <span className={styles.metricValue}>{inputTokens}</span>
              </div>
            </div>
          </div>

          {/* Right Area: Output */}
          <div className={styles.section}>
            <label className={styles.label} htmlFor="output">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Optimized Result
            </label>
            <div className={styles.card}>
              <textarea
                id="output"
                className={styles.textarea}
                readOnly
                placeholder="Optimized output will appear here..."
                value={outputText}
              />
            </div>
            <div className={styles.metrics}>
              <div className={styles.metricChip}>
                <span>Words:</span>
                <span className={styles.metricValue}>{outputWords}</span>
              </div>
              <div className={styles.metricChip}>
                <span>Tokens (est.):</span>
                <span className={styles.metricValue}>{outputTokens}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Error Banner (Replaces ugly browser alerts) */}
        {errorMessage && (
          <div className={styles.errorBanner}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={handleOptimize}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {/* Note: Uses the .spinner class defined in CSS since we aren't using Tailwind */}
                <svg
                  className={styles.spinner}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Optimize via API
              </>
            )}
          </button>
        </div>

        {/* Bottom Label: Optimization Percentage */}
        <div className={styles.optimizationFooter}>
          <div className={styles.optimizationCard}>
            <span className={styles.optimizationLabel}>
              Optimization Achieved
            </span>
            <span className={styles.optimizationValue}>
              {optimizationPercent}
              <span>%</span>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
