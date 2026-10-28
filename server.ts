import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" }));

// Local persistent storage file for saved projects
const DATA_DIR = path.resolve("./data");
const PROJECTS_FILE = path.join(DATA_DIR, "saved_projects.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadSavedProjects(): any[] {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading saved projects:", err);
  }
  return [];
}

function saveProjectsToFile(projects: any[]) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving projects:", err);
  }
}

// System Status Endpoint
app.get("/api/system-status", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: "online",
    hasApiKey: hasKey,
    freeTierModel: "gemini-3.8-flash",
    fallbackModel: "gemini-flash-latest",
    quotaInfo: "Gemini Free Tier: 15 Requests Per Minute (RPM), 1,000,000 Tokens Per Minute (TPM), 1,500 Requests Per Day (RPD). Zero billing required.",
    pricingRef: "https://ai.google.dev/gemini-api/docs/pricing",
  });
});

// Projects Storage API
app.get("/api/projects", (req, res) => {
  const projects = loadSavedProjects();
  res.json({ projects });
});

app.post("/api/projects", (req, res) => {
  const project = req.body;
  if (!project || !project.id) {
    res.status(400).json({ error: "Invalid project payload" });
    return;
  }
  const projects = loadSavedProjects();
  const existingIndex = projects.findIndex((p: any) => p.id === project.id);
  if (existingIndex >= 0) {
    projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveProjectsToFile(projects);
  res.json({ success: true, project });
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  let projects = loadSavedProjects();
  projects = projects.filter((p: any) => p.id !== id);
  saveProjectsToFile(projects);
  res.json({ success: true });
});

// Real Gemini AI Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  const { idea, audience, problem, solutions } = req.body;

  if (!idea?.trim() || !audience?.trim() || !problem?.trim() || !solutions?.trim()) {
    res.status(400).json({
      error: "MISSING_FIELDS",
      message: "All four project fields (Idea, Target Audience, Problem, and Current Solutions) are required."
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") {
    res.status(400).json({
      error: "MISSING_API_KEY",
      message: "GEMINI_API_KEY is not configured in server environment secrets. Please set GEMINI_API_KEY in your AI Studio Secrets or environment variables to enable free-tier AI analysis."
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemPrompt = `You are ProjectLens, an elite autonomous product strategist, venture researcher, and software architect.
Your mission is to perform a deep-dive, uncompromising, highly practical viability analysis of the user's project idea.
You must adapt your entire analysis specifically and uniquely to the submitted project information. Do not return generic or repetitive platitudes.

Analyze across 5 interconnected dimensions:
1. Executive & Market Overview (Title, score, feasibility, radar metrics)
2. Research & Market (Realistic user personas with core frictions, competitor landscape table, 5 critical market research questions, verified domain repositories/standards)
3. Risk & Validation (Problem clarity rating, willingness to pay assessment, key assumptions, potential user needs, prioritized severity-likelihood risk matrix with concrete mitigations, 4 empirical smoke test experiments with measurable success criteria)
4. Improve & Differentiate (Specific concept vulnerabilities, missing features/gaps, high-impact moat opportunities, tactical recommendations)
5. Build & MVP Roadmap (Phased Must/Should/Nice feature prioritization, 4 phased sprint milestones, suggested tech stack, 72-hour immediate execution checklist)
6. Final Project Plan (Concise executive synthesis, problem statement, target audience, proposed solution, key features, main risks, MVP scope, recommended next steps, and complete formatted Markdown specification)

Return ONLY a valid JSON object matching the requested schema.`;

    const userPrompt = `PROJECT DETAILS SUBMITTED BY USER:
- Idea Description: ${idea}
- Target Audience: ${audience}
- Problem You're Solving: ${problem}
- Current Solutions: ${solutions}

Generate the complete ProjectLens analysis strictly in JSON format with the following structure:
{
  "title": "Clear, Professional Project Name",
  "tagline": "A crisp, memorable one-sentence positioning tagline",
  "clarityScore": 92,
  "feasibilityIndex": 88,
  "riskRating": "Low" | "Medium" | "High",
  "estimatedWeeksToAlpha": 6,
  "radarScores": {
    "demand": 94,
    "techEase": 80,
    "defensibility": 86,
    "velocity": 90
  },
  "executiveSummary": "Deep strategic assessment of the opportunity...",
  "strategicPillars": {
    "primaryAdvantage": "Primary unfair advantage or core technological/workflow edge",
    "targetAudiencePillar": "Specific profile of initial beachhead cohort",
    "monetizationPath": "Realistic business/monetization model"
  },
  "research": {
    "personas": [
      {
        "id": "P1",
        "title": "Persona Name/Role",
        "demographics": "Age, background, tech proficiency",
        "description": "Daily reality and context of need",
        "coreFriction": "Sharpest unresolved daily pain point"
      }
    ],
    "competitorAnalysis": [
      {
        "solutionClass": "Existing tool or workaround category",
        "coreStrengths": "What they currently do well",
        "criticalWeaknesses": "Where they fail or leave users frustrated",
        "opportunityGap": "How this project creates a decisive wedge"
      }
    ],
    "marketResearchQuestions": [
      "Inquiry 1 to investigate",
      "Inquiry 2 to investigate",
      "Inquiry 3 to investigate",
      "Inquiry 4 to investigate",
      "Inquiry 5 to investigate"
    ],
    "domainAuthoritySources": [
      {
        "name": "Real API/Dataset/Standard Name",
        "type": "e.g. Open Standard, Gov API, Public Index",
        "description": "How the project can ingest or leverage this real source"
      }
    ]
  },
  "validate": {
    "problemClarity": {
      "status": "Verified High" | "Moderate" | "Under-specified",
      "explanation": "Why this problem is urgent or frequent"
    },
    "willingnessToPay": {
      "assessment": "High" | "Moderate" | "Low / Ad-supported",
      "pricingModel": "e.g., $4.99/mo student tier or B2B SaaS",
      "details": "Justification of pricing tolerance and free-tier hook"
    },
    "mainAssumptions": [
      "Key assumption 1",
      "Key assumption 2",
      "Key assumption 3"
    ],
    "potentialUserNeeds": [
      "Need 1",
      "Need 2",
      "Need 3"
    ],
    "prioritizedRisks": [
      {
        "tier": "Tier 1: Fatal Risk" | "Tier 2: Tech/Adoption Risk" | "Tier 3: Operational Risk",
        "title": "Risk title",
        "severity": 4,
        "likelihood": 3,
        "description": "Impact breakdown",
        "mitigation": "Concrete action to neutralize this risk"
      }
    ],
    "smokeTestExperiments": [
      {
        "title": "Experiment 1: Smoke Test Name",
        "costDuration": "e.g. $0 • 48 hrs",
        "description": "Detailed execution method",
        "successCriterion": "Clear quantitative threshold"
      }
    ]
  },
  "improve": {
    "vulnerabilities": [
      {
        "title": "Vulnerability Title",
        "description": "Why this represents a pitfall"
      }
    ],
    "missingFeatures": [
      {
        "title": "Overlooked Capability",
        "description": "Feature that competitors lack but users need"
      }
    ],
    "differentiationOpportunities": [
      {
        "title": "Moat Opportunity",
        "moatFactor": "e.g. 9/10",
        "description": "How to execute this differentiator"
      }
    ],
    "specificRecommendations": [
      "Actionable recommendation 1",
      "Actionable recommendation 2",
      "Actionable recommendation 3",
      "Actionable recommendation 4"
    ]
  },
  "build": {
    "mvpFeatures": {
      "mustHave": [
        { "title": "Feature 1", "description": "Scope details" }
      ],
      "shouldHave": [
        { "title": "Feature 2", "description": "Scope details" }
      ],
      "niceToHave": [
        { "title": "Feature 3", "description": "Scope details" }
      ]
    },
    "sprintRoadmap": [
      {
        "sprint": "SPRINT 01",
        "timeRange": "Weeks 1-2",
        "title": "Foundation & Core Architecture",
        "description": "Focus and architectural baseline",
        "keyDeliverables": ["Deliverable A", "Deliverable B"]
      },
      {
        "sprint": "SPRINT 02",
        "timeRange": "Weeks 3-4",
        "title": "Core Workflows & User Experience",
        "description": "Implementation of key loops",
        "keyDeliverables": ["Deliverable C", "Deliverable D"]
      },
      {
        "sprint": "SPRINT 03",
        "timeRange": "Weeks 5-6",
        "title": "Integration, Feedback & Hardening",
        "description": "Data pipelines and polish",
        "keyDeliverables": ["Deliverable E", "Deliverable F"]
      },
      {
        "sprint": "SPRINT 04",
        "timeRange": "Weeks 7-8",
        "title": "Beta Launch & Pilot Cohort",
        "description": "Rollout to first 100 users",
        "keyDeliverables": ["Deliverable G", "Deliverable H"]
      }
    ],
    "suggestedTechStack": {
      "frontend": "Modern Framework recommendation (e.g. React/TypeScript with Tailwind)",
      "backend": "Backend choice (e.g. Node.js/Express, Python/FastAPI)",
      "database": "Storage engine (e.g. PostgreSQL, SQLite, Firestore)",
      "aiServices": "Model or AI APIs (e.g. Google Gemini 2.5 Flash-Lite free tier)",
      "auth": "Auth solution (e.g. Firebase Auth, Supabase Auth, Lucia)"
    },
    "immediate72HourChecklist": [
      { "task": "Immediate action 1", "done": false },
      { "task": "Immediate action 2", "done": false },
      { "task": "Immediate action 3", "done": false },
      { "task": "Immediate action 4", "done": false }
    ]
  },
  "finalProjectPlan": {
    "problemStatement": "Clear 2-3 sentence problem breakdown",
    "targetAudience": "Summary of target users",
    "proposedSolution": "Summary of proposed solution",
    "keyFeatures": ["Key feature 1", "Key feature 2", "Key feature 3", "Key feature 4"],
    "mainRisks": ["Risk 1 and mitigation", "Risk 2 and mitigation"],
    "mvpScope": "Clear boundary of what is in v1.0 and what is postponed",
    "recommendedNextSteps": ["Step 1", "Step 2", "Step 3"],
    "markdownSpecification": "Complete formatted Markdown specification document"
  }
}`;

    // Models available on free-tier
    const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];
    let rawText = "";
    let usedModel = "gemini-3.8-flash";
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `${systemPrompt}\n\n${userPrompt}`,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });
        rawText = response.text || "";
        if (rawText) {
          usedModel = model;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} call failed: ${err.message}. Trying next candidate...`);
        lastError = err;
      }
    }

    if (!rawText && lastError) {
      throw lastError;
    }

    if (!rawText) {
      throw new Error("Empty response received from Gemini model.");
    }

    // Clean JSON response if wrapped in code blocks
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.slice(7);
    }
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.slice(3);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    const parsedData = JSON.parse(cleanJson);
    
    // Add metadata
    parsedData.id = "proj_" + Date.now();
    parsedData.createdAt = new Date().toISOString();
    parsedData.inputs = { idea, audience, problem, solutions };
    parsedData.modelUsed = usedModel;

    // Save automatically to persistent storage
    const allProjects = loadSavedProjects();
    allProjects.unshift(parsedData);
    saveProjectsToFile(allProjects);

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini AI Analysis Error:", error);

    // Check for rate limit or quota exceeded
    const errMsg = error.message || "";
    let userFriendlyError = "An unexpected error occurred while analyzing your project with Gemini.";
    let errorCode = "API_ERROR";

    if (errMsg.includes("429") || errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("rate limit")) {
      errorCode = "RATE_LIMIT";
      userFriendlyError = "Gemini Free Tier rate limit or quota reached. Free tier allows 15 RPM. Please wait 15 seconds and try again.";
    } else if (errMsg.toLowerCase().includes("api_key") || errMsg.toLowerCase().includes("unauthenticated")) {
      errorCode = "INVALID_KEY";
      userFriendlyError = "Invalid or expired GEMINI_API_KEY. Please verify your API key in Google AI Studio.";
    } else {
      userFriendlyError = `AI Service Error: ${errMsg.slice(0, 200)}`;
    }

    res.status(500).json({
      error: errorCode,
      message: userFriendlyError,
      details: error.message,
    });
  }
});

// Serve frontend with Vite in dev, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`[ProjectLens] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start ProjectLens server:", err);
  process.exit(1);
});
