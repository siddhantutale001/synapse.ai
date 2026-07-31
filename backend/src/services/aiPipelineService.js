const { dbStore } = require('../config/firebase');

/**
 * Simulates / executes the asynchronous iNSIGHTS Layer 2 AI pipeline
 * Transitions state through RESEARCHING -> CLUSTERING -> GENERATING -> COMPLETED
 */
const triggerInsightsPipeline = async (workspaceId, title, rawIdea, userId) => {
  try {
    // 1. Initial State: RESEARCHING
    await dbStore.setWorkspace(workspaceId, {
      status: 'RESEARCHING'
    });

    // Asynchronous background execution (simulating or invoking AI microservice)
    setTimeout(async () => {
      try {
        // 2. Transition to CLUSTERING
        await dbStore.setWorkspace(workspaceId, {
          status: 'CLUSTERING'
        });

        const deepsearch = {
          problemValidation: {
            summary: `Analysis of "${rawIdea}": High-impact engineering domain addressing hostel dining hall operations. Food waste in higher education dining halls accounts for up to 35% of total prepared meals globally.`,
            severityScore: 8.5
          },
          citations: [
            {
              id: "cit_01",
              title: "Smart Mess Management System using Computer Vision",
              authors: ["R. Sharma", "A. Verma"],
              source: "IEEE Xplore",
              url: "https://doi.org/10.1109/EXAMPLE.2025.123456",
              snippet: "Convolutional Neural Networks achieved 92% accuracy in portion leftover estimation...",
              relevanceScore: 0.94
            },
            {
              id: "cit_02",
              title: "Predictive Analytics for Meal Planning in Campus Dining",
              authors: ["K. Patel", "J. Lee"],
              source: "ACM SIGKDD",
              url: "https://doi.org/10.1145/EXAMPLE.2025.789101",
              snippet: "Time-series forecasting models reduced food over-preparation by 28% in university campuses...",
              relevanceScore: 0.91
            }
          ]
        };

        const clustering = {
          existingSolutions: [
            { category: "Manual Log Systems", description: "Google Sheets logging by mess staff." },
            { category: "Static Attendance Records", description: "Paper roster matching without real-time predictive analytics." }
          ],
          researchGaps: [
            "Lack of attendance-driven real-time meal demand forecasting",
            "Minimal integration between mobile RSVP systems and kitchen prep workflows"
          ],
          innovationOpportunities: [
            "Combine attendance prediction algorithm with CV plate waste estimation",
            "Real-time dynamic kitchen prep quantity alerts via companion bot"
          ]
        };

        // 3. Transition to GENERATING
        await dbStore.setWorkspace(workspaceId, {
          status: 'GENERATING',
          deepsearch,
          clustering
        });

        // 4. Generate Project Hub Roadmap
        const projectHub = {
          architecture: {
            diagramMermaid: "graph TD; A[Student Mobile App] --> B[Express API]; B --> C[Python Forecast Engine]; C --> D[Cloud Firestore];",
            architecture_stages: [
              { stage_name: "1. Input (App & Ingestion)", tech_description: "Student Mobile App, API Gateway & Auth Buffer" },
              { stage_name: "2. Predict (API & Microservice)", tech_description: "Express Services, Python AI Engine & Firestore" },
              { stage_name: "3. Match (ML & Analytics)", tech_description: "Forecast Engine, Solution Matrix & Alert Routing" }
            ]
          },
          recommendedTechStack: {
            frontend: ["React", "Tailwind CSS"],
            backend: ["Node.js", "Express", "Clerk"],
            database: ["Firebase Firestore"]
          },
          milestones: [
            { id: "m_1", title: "Phase 1: RSVP Module", duration: "Days 1-3", status: "COMPLETED" },
            { id: "m_2", title: "Phase 2: Demand Prediction Engine", duration: "Days 4-6", status: "IN_PROGRESS" },
            { id: "m_3", title: "Phase 3: Companion Bot Alerts", duration: "Days 7-10", status: "PENDING" }
          ]
        };

        // 5. Final State: COMPLETED
        await dbStore.setWorkspace(workspaceId, {
          status: 'COMPLETED',
          projectHub
        });

        console.log(`✅ iNSIGHTS Layer 2 pipeline completed for workspace ${workspaceId}`);
      } catch (pipelineErr) {
        console.error(`❌ Pipeline failed for workspace ${workspaceId}:`, pipelineErr);
        await dbStore.setWorkspace(workspaceId, {
          status: 'FAILED'
        });
      }
    }, 1000);

  } catch (err) {
    console.error('Error triggering pipeline:', err);
  }
};

module.exports = { triggerInsightsPipeline };
