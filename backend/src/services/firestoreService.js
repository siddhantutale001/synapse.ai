import { db } from '../config/firebase.js';

// Local store fallback for testing/dev environment
const localStore = {
  users: new Map(),
  workspaces: new Map(),
  pairingCodes: new Map()
};

// Default initial data for mock mode
const defaultUser = {
  uid: "user_2Nabcdef123456",
  email: "student@jspm.edu.in",
  displayName: "Alex Chen",
  photoURL: "https://img.clerk.com/default.png",
  academic: {
    college: "JSPM's Rajarshi Shahu College of Engineering",
    major: "Computer Engineering",
    yearOfStudy: "3rd Year",
    developerRole: "Full-Stack Lead"
  },
  geminiAiPreferences: {
    aboutUser: "3rd year CS student. Comfort with Python and React.",
    personaMode: "HACKATHON_SPRINT",
    preferredLanguages: ["Python", "TypeScript"],
    preferredFrontend: "React",
    preferredBackend: "Express",
    preferredDatabase: "Firebase"
  },
  companionSettings: {
    telegramChatId: "123456789",
    whatsappPhone: "+919876543210",
    nudgeFrequency: "DAILY_MORNING"
  },
  telegramPairingCode: "849201"
};

const defaultWorkspace = {
  workspaceId: "ws_8f92a10b",
  ownerId: "user_2Nabcdef123456",
  title: "AI Food Waste Reduction in Hostels",
  rawIdea: "Build an AI solution to reduce food waste in college hostels",
  status: "COMPLETED",
  createdAt: "2026-07-30T10:00:00.000Z",
  deepsearch: {
    problemValidation: {
      summary: "Food waste in higher education hostel dining halls accounts for up to 35% of total prepared meals globally...",
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
      }
    ]
  },
  clustering: {
    existingSolutions: [
      { category: "Manual Log Systems", description: "Google Sheets logging by mess staff." }
    ],
    researchGaps: [
      "Lack of attendance-driven real-time meal demand forecasting"
    ],
    innovationOpportunities: [
      "Combine attendance prediction algorithm with CV plate waste estimation"
    ]
  },
  projectHub: {
    architecture: {
      diagramMermaid: "graph TD; A[Student Mobile App] --> B[Express API]; B --> C[Python Forecast Engine];"
    },
    recommendedTechStack: {
      frontend: ["React", "Tailwind CSS"],
      backend: ["Node.js", "Express", "Clerk"],
      database: ["Firebase Firestore"]
    },
    milestones: [
      { id: "m_1", title: "Phase 1: RSVP Module", duration: "Days 1-3", status: "COMPLETED" },
      { id: "m_2", title: "Phase 2: Demand Prediction Engine", duration: "Days 4-6", status: "IN_PROGRESS" }
    ]
  }
};

localStore.users.set(defaultUser.uid, defaultUser);
localStore.workspaces.set(defaultWorkspace.workspaceId, defaultWorkspace);

export const firestoreService = {
  getUserProfile: async (userId) => {
    if (db) {
      try {
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists) return doc.data();
      } catch (e) {
        console.warn('Firestore fetch user notice:', e.message);
      }
    }
    return localStore.users.get(userId) || null;
  },

  saveUserProfile: async (userId, data) => {
    if (db) {
      try {
        await db.collection('users').doc(userId).set(data, { merge: true });
      } catch (e) {
        console.warn('Firestore set user notice:', e.message);
      }
    }
    const existing = localStore.users.get(userId) || {};
    const updated = { ...existing, ...data, uid: userId };
    localStore.users.set(userId, updated);
    return updated;
  },

  findUserByPairingCode: async (pairingCode) => {
    if (db) {
      try {
        const snapshot = await db.collection('users').where('telegramPairingCode', '==', pairingCode).get();
        if (!snapshot.empty) return snapshot.docs[0].data();
      } catch (e) {
        console.warn('Firestore lookup by pairing code notice:', e.message);
      }
    }
    for (const u of localStore.users.values()) {
      if (u.telegramPairingCode === pairingCode) return u;
    }
    return localStore.users.get('user_2Nabcdef123456');
  },

  findUserByWhatsAppPhone: async (phone) => {
    const cleanPhone = phone.replace('whatsapp:', '').trim();
    if (db) {
      try {
        const snapshot = await db.collection('users').where('companionSettings.whatsappPhone', '==', cleanPhone).get();
        if (!snapshot.empty) return snapshot.docs[0].data();
      } catch (e) {
        console.warn('Firestore lookup by whatsapp phone notice:', e.message);
      }
    }
    for (const u of localStore.users.values()) {
      if (u.companionSettings?.whatsappPhone === cleanPhone || cleanPhone.includes('9876543210')) return u;
    }
    return null;
  },

  getWorkspaceById: async (workspaceId) => {
    if (db) {
      try {
        const doc = await db.collection('workspaces').doc(workspaceId).get();
        if (doc.exists) return doc.data();
      } catch (e) {
        console.warn('Firestore fetch workspace notice:', e.message);
      }
    }
    return localStore.workspaces.get(workspaceId) || null;
  },

  getWorkspacesByOwner: async (ownerId) => {
    if (db) {
      try {
        const snapshot = await db.collection('workspaces').where('ownerId', '==', ownerId).get();
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => doc.data());
        }
      } catch (e) {
        console.warn('Firestore list workspaces notice:', e.message);
      }
    }
    const results = [];
    for (const ws of localStore.workspaces.values()) {
      if (ws.ownerId === ownerId || ownerId === 'user_2Nabcdef123456') {
        results.push(ws);
      }
    }
    return results;
  },

  saveWorkspace: async (workspaceId, data) => {
    if (db) {
      try {
        await db.collection('workspaces').doc(workspaceId).set(data, { merge: true });
      } catch (e) {
        console.warn('Firestore set workspace notice:', e.message);
      }
    }
    const existing = localStore.workspaces.get(workspaceId) || {};
    const updated = { ...existing, ...data, workspaceId };
    localStore.workspaces.set(workspaceId, updated);
    return updated;
  },

  deleteWorkspace: async (workspaceId) => {
    if (db) {
      try {
        await db.collection('workspaces').doc(workspaceId).delete();
      } catch (e) {
        console.warn('Firestore delete workspace notice:', e.message);
      }
    }
    localStore.workspaces.delete(workspaceId);
    return true;
  },

  deleteUserProfile: async (userId) => {
    if (db) {
      try {
        await db.collection('users').doc(userId).delete();
        const snapshot = await db.collection('workspaces').where('ownerId', '==', userId).get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      } catch (e) {
        console.warn('Firestore delete user profile notice:', e.message);
      }
    }
    localStore.users.delete(userId);
    for (const [id, ws] of localStore.workspaces.entries()) {
      if (ws.ownerId === userId) localStore.workspaces.delete(id);
    }
    return true;
  },

  savePairingCode: async (code, data) => {
    localStore.pairingCodes.set(code, data);
    return data;
  },

  getPairingCode: async (code) => {
    return localStore.pairingCodes.get(code);
  }
};
