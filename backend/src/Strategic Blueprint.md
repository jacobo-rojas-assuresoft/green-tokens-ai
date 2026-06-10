# Strategic Blueprint: From Prototype to Production-Ready LLM Features

### 1. Mission Brief
You are the Lead AI Architect. Your goal isn't just to "call an API"—it's to architect a robust, scalable LLM system that solves a high-stakes engineering bottleneck. You will design, build, and defend a solution that demonstrates Architectural Thinking and Production Readiness.

### 2. The innovation journey (Sprint Phases)
#### Phase 1: The High-Value Target
- Action: Don't pick an easy problem; pick a painful one.
- Examples: An AI that performs Root Cause Analysis on production incidents, or a RAG-based agent that generates PR descriptions from Jira tickets and code diffs.
- Goal: Define the ROI (Return on Investment). Why should the company spend $0.05 per call on this?

#### Phase 2: System Architecture (The Blueprint)
- Action: Design your "Orchestration Layer." Will you use LCEL (LangChain Expression Language)? An Agentic workflow with Tool-calling?
- Engineering Requirement: You must include a diagram showing the data flow: User -> Embedding -> Vector Store -> LLM -> Output Parser.

#### Phase 3: Prototype & Iteration (The Lab)
- Action: Build the core logic.
- The "Pro" Touch: Implement at least one advanced optimization technique, such as:
  - Parent Document Retrieval (for better context).
  - Self-Querying (to handle metadata).
  - Contextual Compression (to save tokens and reduce latency).

#### Phase 4: The Reality Check (Trade-offs & Production)
- Action: Defend your decisions.
- Critical Thinking: Why did you choose gpt-4o-mini over claude-3.5-sonnet? How are you handling Prompt Injection? What is your fallback if the Vector Store returns 0 results?

### 3. Your Architect (Deliverables)
To pass the Engineering Review, you must submit to Moodle:
1. 📑 The Technical Design Document (TDD):
  - A 5-8 page PDF. Focus on the "Why" more than the "What."
  - Include your Architecture Diagram.
2. 💻 The Repository (Codebase):
  - A clean, documented GitHub repo or ZIP.
  - Must include a README.md with instructions on how to run the prototype.
3. 🔬 Evaluation Evidence:
  - Screenshots of LangSmith traces or manual logs showing how you fixed a hallucination or improved a prompt.

### 4. Evaluation Criteria
|Score | Criteria | The "Excellent" Standard |
|----- | -------- | ------------------------ |
|20%|Architecture|System is modular, using RAG or Agents effectively.|
|20%|Implementation|Prototype works and handles edge cases (e.g., empty inputs).|
|15%|Iteration|Evidence that you tested, found a flaw, and improved it.|
|10%|Prod-Readiness|Concrete plan for monitoring, security, and cost control.|
|35%|Problem & Logic|Clear business value and sound technical reasoning.|
