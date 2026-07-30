export const fallbackPlanData = {
  id: "ws_demo_fallback",
  shareCode: "SYNC-7788",
  title: "AI-Powered Medical Triage & Diagnostics Assistant",
  rawIdea: "An AI-powered emergency medical triage system that analyzes preliminary patient symptoms, vital signs, and speech context to prioritize ER queues and assist rural clinic nurses.",
  tags: ["Healthcare", "AI/ML", "Real-Time Systems", "Telemedicine"],
  
  problem_framing: {
    core_problem: "Rural health outposts and urban emergency departments face high diagnostic delays and mis-triage during surge hours.",
    target_users: "Emergency Nurses, Paramedics, Triage Staff, Rural Health Practitioners.",
    why_it_matters: "Reduces emergency triage processing time by 35% and improves detection accuracy for critical respiratory and cardiac presentations."
  },
  
  deep_search_insights: [
    {
      angle: "Clinical Accuracy & Diagnostic AI",
      insight: "Transformer-based clinical triage models achieve 94.2% sensitivity in distinguishing urgent vs non-urgent presentations (arXiv:2401.0892).",
      citations: ["arXiv:2401.0892", "Nature Digital Medicine 2024"]
    },
    {
      angle: "Edge Computing & Low Connectivity",
      insight: "Quantized ONNX models running on mobile edge hardware sustain real-time inference without requiring cloud connectivity.",
      citations: ["IEEE Trans Biomedical Eng 2023", "GitHub: edge-med-triage"]
    },
    {
      angle: "Regulatory & Ethical Compliance",
      insight: "Local federated learning architectures isolate Patient Health Information (PHI) to satisfy HIPAA and GDPR requirements.",
      citations: ["FDA AI Framework 2024"]
    }
  ],

  comparison_matrix: [
    {
      competitor: "Epic Systems Triage Module",
      approach: "Rule-based decision trees embedded in EHR software.",
      limitations: "Static decision rules; lacks voice & vitals telemetry fusion.",
      our_advantage: "Multimodal Gemini reasoning + acoustic voice marker analysis."
    },
    {
      competitor: "Ada Health",
      approach: "Direct-to-consumer mobile symptom questionnaire.",
      limitations: "Slow questionnaire workflow; isolated from hospital queue monitors.",
      our_advantage: "Real-time clinical dashboard with live vitals sync and priority queueing."
    },
    {
      competitor: "K Health AI",
      approach: "Statistical matching against historical doctor notes.",
      limitations: "Requires persistent 5G connection; no citation grounding.",
      our_advantage: "Search grounding citations, offline edge execution, and audit trails."
    }
  ],

  innovation_gaps: [
    {
      gap_title: "Multimodal Voice & Vitals Fusion",
      description: "Integrates real-time acoustic markers (breathlessness, tremor) with BLE pulse oximeter telemetry.",
      impact: "+22% triage accuracy for acute respiratory distress."
    },
    {
      gap_title: "Offline-First Synchronization",
      description: "In-memory edge storage auto-synchronizes with central servers over WebSockets upon network recovery.",
      impact: "Zero downtime during clinic network outages."
    },
    {
      gap_title: "Citation-Grounded Recommendations",
      description: "Generates clinical justification referencing peer-reviewed literature for nurse verification.",
      impact: "Eliminates diagnostic hallucination risks."
    }
  ],

  project_architecture: {
    overview: "Client-Server Hybrid Architecture with Real-Time WebSockets Synchronization.",
    layers: [
      { name: "Presentation Layer", components: "React 18, Vite, Tailwind CSS", protocol: "Client Render" },
      { name: "Real-Time Gateway", components: "Node.js Express + Socket.IO Server", protocol: "WebSockets" },
      { name: "AI Inference Engine", components: "Google Gemini 2.5 Flash + Search Grounding", protocol: "REST API" },
      { name: "Storage Layer", components: "MongoDB / Local In-Memory Fallback Store", protocol: "Mongoose Protocol" }
    ],
    diagram_mermaid: "graph TD\n  User[Nurse / Patient] --> ReactUI[React 18 UI]\n  ReactUI <--> SocketServer[Socket.IO Gateway]\n  SocketServer --> AI[Gemini 2.5 Flash API]\n  SocketServer --> DB[(MongoDB / Local Fallback)]\n  SocketServer <--> TeleBot[Telegram Bot Companion]"
  },

  action_roadmap: [
    { step_number: 1, title: "Data Protocols & Schema Definition", description: "Define ESI triage protocols and structured output schemas.", completed: true },
    { step_number: 2, title: "Core Engine & Fallback Storage", description: "Build Express endpoints with MongoDB and in-memory store fallback.", completed: true },
    { step_number: 3, title: "React 18 Dashboard & 11 Output Sections", description: "Develop glassmorphism interface and section modules.", completed: true },
    { step_number: 4, title: "Socket.IO Multi-User Room Sync", description: "Implement real-time room sharing and collaborator presence.", completed: false },
    { step_number: 5, title: "Telegram Companion & Export Module", description: "Integrate Telegram bot alerts and 1-Click PDF export.", completed: false }
  ],

  recommended_tech_stack: {
    frontend: "React 18, Vite, Tailwind CSS, Lucide React",
    backend_or_api: "Node.js, Express.js, Socket.IO",
    data_storage: "MongoDB Atlas / In-Memory Fallback Store",
    cloud_and_apis: "Google Gemini 2.5 Flash API, Telegram Bot API",
    justification: "Zero-cost tier stack supporting sub-second latency and offline reliability."
  },

  github_repositories: [
    { name: "google-gemini/gemini-api-js", url: "https://github.com/google-gemini/gemini-api-js", description: "JavaScript SDK for Gemini 2.5 API with search grounding support.", stars: "4.8k★" },
    { name: "socketio/socket.io", url: "https://github.com/socketio/socket.io", description: "Real-time event engine for multi-user sync.", stars: "61.2k★" },
    { name: "facebook/react", url: "https://github.com/facebook/react", description: "Declarative component library for reactive interfaces.", stars: "228k★" },
    { name: "tailwindlabs/tailwindcss", url: "https://github.com/tailwindlabs/tailwindcss", description: "Utility-first CSS framework.", stars: "82k★" }
  ],

  apis_and_datasets: [
    { type: "Dataset", name: "MIMIC-IV Emergency Department", provider: "PhysioNet / Kaggle", url: "https://www.kaggle.com/datasets/mimic-iv", description: "De-identified dataset of 400,000+ emergency department visits with vital signs." },
    { type: "Dataset", name: "eICU Collaborative Database", provider: "PhysioNet / Kaggle", url: "https://eicu-crd.mit.edu/", description: "Telemetry records and clinical notes for critical care patient monitoring." },
    { type: "API", name: "Google Gemini 2.5 Flash API", provider: "Google AI Studio", url: "https://ai.google.dev/", description: "Multimodal LLM with Google Search Grounding." },
    { type: "API", name: "Telegram Bot API", provider: "Telegram", url: "https://core.telegram.org/bots/api", description: "Bot API for real-time mobile notifications." }
  ],

  implementation_timeline: [
    { phase: "Phase 1: Architecture & Schema", duration: "Week 1", milestone: "Requirements & Schemas", deliverables: "System architecture and data contracts." },
    { phase: "Phase 2: Grounding & Server Logic", duration: "Week 2", milestone: "API & Grounding Pipeline", deliverables: "Express server and search grounding integration." },
    { phase: "Phase 3: Frontend Dashboard", duration: "Week 3", milestone: "Interactive UI", deliverables: "React 18 components and section views." },
    { phase: "Phase 4: Real-Time & Telegram", duration: "Week 4", milestone: "Multi-User & Companion", deliverables: "Socket.IO room sync and Telegram bot integration." },
    { phase: "Phase 5: Deck Export & Testing", duration: "Week 5", milestone: "Production Release", deliverables: "1-Click PDF export and end-to-end verification." }
  ],

  pitch_deck_outline: [
    { slide_number: 1, title: "Title: Emergency Triage Copilot", bullet_points: ["AI clinical triage for emergency & rural healthcare", "Powered by Google Gemini 2.5 Flash & Grounding"] },
    { slide_number: 2, title: "The Problem", bullet_points: ["4+ hour ER delays in rural outposts", "35% of critical cases suffer preventable complications"] },
    { slide_number: 3, title: "The Solution", bullet_points: ["Multimodal AI assistant fusing symptom & vital telemetry", "Citation-backed diagnosis & real-time team queue sync"] },
    { slide_number: 4, title: "Market & Innovation Gaps", bullet_points: ["Legacy software is rigid, costly, and offline-incompatible", "Zero-cost tier, offline-first, citation-grounded"] },
    { slide_number: 5, title: "Architecture & Live Demo", bullet_points: ["Socket.IO multi-user room synchronization", "Telegram Bot mobile companion"] }
  ]
};

export const presetIdeas = [
  {
    label: "🏥 Medical Triage Copilot",
    title: "AI-Powered Medical Triage & Diagnostics Assistant",
    idea: "An AI-powered emergency medical triage system that analyzes preliminary patient symptoms, vital signs, and speech context to prioritize ER queues and assist rural clinic nurses."
  },
  {
    label: "🌱 Smart Agriculture Swarm",
    title: "Autonomous Drone Swarm Crop Monitoring Network",
    idea: "An IoT and computer vision platform using autonomous micro-drones to detect early pest infestations, soil moisture deficiencies, and crop diseases in real time."
  },
  {
    label: "⛓️ Blockchain Supply Chain",
    title: "Zero-Knowledge Supply Chain Traceability Engine",
    idea: "A privacy-preserving supply chain verification system using zero-knowledge proofs and IoT temperature sensors to guarantee pharmaceutical authenticity."
  },
  {
    label: "⚡ Smart Microgrid Energy Router",
    title: "Peer-to-Peer Renewable Microgrid Energy Exchanger",
    idea: "A localized energy trading platform that uses predictive AI to route excess solar/wind power between neighborhood smart meters during peak demand."
  }
];
