export const defaultProfile = {
  uid: "user_2Nabcdef123456",
  displayName: "Alex Chen",
  email: "alex.chen@jspm.edu.in",
  academic: {
    college: "JSPM's Rajarshi Shahu College of Engineering",
    major: "Computer Engineering",
    yearOfStudy: "3rd Year",
    developerRole: "Full-Stack Lead"
  },
  geminiAiPreferences: {
    aboutUser: "3rd year CS student. Comfort with Python FastAPI, React, and Cloud Firestore.",
    personaMode: "HACKATHON_SPRINT",
    preferredLanguages: ["Python", "TypeScript"],
    preferredFrontend: "React",
    preferredBackend: "Express",
    preferredDatabase: "Firebase"
  }
};

function extractKeywords(text) {
  if (!text) return ["Innovation", "Analytics"];
  const words = text.match(/\b[A-Za-z]{3,}\b/g) || [];
  const stopwords = new Set(["build", "with", "that", "this", "from", "using", "your", "have", "will", "make", "system", "app", "solution", "project", "for", "and", "the"]);
  const filtered = words.filter(w => !stopwords.has(w.toLowerCase())).map(w => w.charAt(0).toUpperCase() + w.slice(1));
  return filtered.length > 0 ? filtered : ["Innovation", "Research"];
}

export function createDynamicWorkspace(title = "New Research Project", rawIdea = "Autonomous Intelligent System Architecture") {
  const kw = extractKeywords(title + " " + rawIdea);
  const kw1 = kw[0] || "System";
  const kw2 = kw[1] || "Analytics";
  const wsId = `ws_${Math.random().toString(36).substring(2, 10)}`;

  return {
    workspaceId: wsId,
    title,
    rawIdea,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    deepsearch: {
      problemValidation: {
        summary: `Technical analysis for "${rawIdea}": High impact potential in ${kw1} research. Solves critical performance and scalability challenges using dynamic state-of-the-art algorithms.`,
        severityScore: 8.8
      },
      citations: [
        {
          id: "cit_01",
          title: `Smart SOTA Framework for ${kw1} & ${kw2}`,
          authors: ["R. Sharma", "A. Verma"],
          source: "IEEE Xplore",
          type: "PAPER",
          url: `https://doi.org/10.1109/${kw1.toUpperCase()}.2025.1001`,
          snippet: `Experimental validation of ${kw1} achieving state-of-the-art performance and resource optimization.`,
          relevanceScore: 0.95
        },
        {
          id: "cit_02",
          title: `Predictive Optimization in ${kw1} Architectures`,
          authors: ["K. Patel", "J. Lee"],
          source: "ACM SIGKDD",
          type: "PAPER",
          url: `https://doi.org/10.1145/${kw2.toUpperCase()}.2025.2002`,
          snippet: `Algorithmic optimization for ${kw2} significantly reducing computational latency.`,
          relevanceScore: 0.92
        },
        {
          id: "cit_03",
          title: `Open-Source Engine for ${kw1}`,
          authors: ["S. Gupta"],
          source: "GitHub",
          type: "GITHUB",
          url: `https://github.com/topics/${kw1.toLowerCase()}-engine`,
          snippet: `Production codebase offering modular components for building ${kw1} applications.`,
          relevanceScore: 0.89
        },
        {
          id: "cit_04",
          title: `Global Benchmark Dataset for ${kw1}`,
          authors: ["Kaggle Research"],
          source: "Kaggle",
          type: "DATASET",
          url: `https://kaggle.com/datasets/${kw1.toLowerCase()}-benchmark`,
          snippet: `Curated dataset for training and testing algorithms in ${kw2}.`,
          relevanceScore: 0.85
        }
      ]
    },
    clustering: {
      existingSolutions: [
        { category: "Legacy Manual Systems", description: `Traditional manual tracking and non-automated workflows for ${kw1}.` },
        { category: "Static Rule Engines", description: `Fixed heuristic threshold models without dynamic machine learning for ${kw2}.` },
        { category: "Siloed Commercial Tools", description: "Standalone software tools lacking open integrations and real-time APIs." },
        { category: "Basic Web Portals", description: "Basic web interfaces lacking predictive machine learning intelligence." }
      ],
      researchGaps: [
        `Lack of real-time predictive analytics specifically optimized for ${kw1}`,
        `Fragmented data ingestion between user interfaces and decision engines`
      ],
      innovationOpportunities: [
        `Combine deep learning models with event-driven streaming for ${kw1}`,
        `Integrate autonomous companion bot for proactive real-time notifications`
      ]
    },
    projectHub: {
      architecture: {
        diagramMermaid: `graph TD; A[User Interface (React 18)] --> B[Express API]; B --> C[Python AI Core]; C --> D[Cloud Firestore];`,
        architecture_stages: [
          { stage_name: "1. Input (Ingestion Layer)", tech_description: "User Interface, API Gateway & Auth Buffer" },
          { stage_name: "2. Predict (Core Microservice)", tech_description: "FastAPI Engine, Logic Controller & Firestore" },
          { stage_name: "3. Match (ML & Analytics)", tech_description: "Model Inference, Solution Matrix & Alert Routing" }
        ]
      },
      recommendedTechStack: {
        frontend: ["React 18", "Tailwind CSS"],
        backend: ["Node.js", "Express.js", "Clerk Auth"],
        database: ["Cloud Firestore"],
        aiEngine: ["Python FastAPI", "Gemini API"],
        bots: ["Telegram Bot API"]
      },
      milestones: [
        { id: "m_1", title: `Phase 1: ${kw1} Core Schema & API Setup`, duration: "Days 1-3", status: "COMPLETED" },
        { id: "m_2", title: `Phase 2: ${kw1} AI Microservice Integration`, duration: "Days 4-6", status: "IN_PROGRESS" },
        { id: "m_3", title: `Phase 3: Real-Time Companion Bot Alerts & Analytics UI`, duration: "Days 7-10", status: "PENDING" },
        { id: "m_4", title: `Phase 4: Prototype Deployment & Field Testing`, duration: "Days 11-14", status: "PENDING" }
      ]
    }
  };
}

export const defaultWorkspace = createDynamicWorkspace("Smart AI Research Copilot", "Build an autonomous AI system for deep web research and paper citation analysis");
