const mongoose = require('mongoose');

// Define Schema for Mongoose
const workspaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rawIdea: { type: String, required: true },
  shareCode: { type: String, unique: true, index: true },
  tags: [String],
  
  // 11 Output Sections
  problem_framing: {
    core_problem: String,
    target_users: String,
    why_it_matters: String
  },
  deep_search_insights: [{
    angle: String,
    insight: String,
    citations: [String]
  }],
  comparison_matrix: [{
    competitor: String,
    approach: String,
    limitations: String,
    our_advantage: String
  }],
  innovation_gaps: [{
    gap_title: String,
    description: String,
    impact: String
  }],
  project_architecture: {
    overview: String,
    layers: [{
      name: String,
      components: String,
      protocol: String
    }],
    diagram_mermaid: String
  },
  action_roadmap: [{
    step_number: Number,
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
  }],
  recommended_tech_stack: {
    frontend: String,
    backend_or_api: String,
    data_storage: String,
    cloud_and_apis: String,
    justification: String
  },
  github_repositories: [{
    name: String,
    url: String,
    description: String,
    stars: String
  }],
  apis_and_datasets: [{
    type: String, // API or Dataset
    name: String,
    provider: String,
    url: String,
    description: String
  }],
  implementation_timeline: [{
    phase: String,
    duration: String,
    milestone: String,
    deliverables: String
  }],
  pitch_deck_outline: [{
    slide_number: Number,
    title: String,
    bullet_points: [String]
  }],
  
  collaborators: [{
    id: String,
    name: String,
    online: Boolean
  }]
}, { timestamps: true });

let MongooseModel = null;
try {
  MongooseModel = mongoose.model('Workspace');
} catch (e) {
  MongooseModel = mongoose.model('Workspace', workspaceSchema);
}

// In-Memory Storage Manager Fallback
class InMemoryWorkspaceStore {
  constructor() {
    this.workspaces = new Map();
  }

  async find(query = {}) {
    let list = Array.from(this.workspaces.values());
    if (query.tag) {
      list = list.filter(w => w.tags && w.tags.includes(query.tag));
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(w => 
        w.title.toLowerCase().includes(q) || 
        w.rawIdea.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async findOne(query = {}) {
    const list = Array.from(this.workspaces.values());
    if (query.shareCode) {
      return list.find(w => w.shareCode === query.shareCode) || null;
    }
    if (query._id) {
      return list.find(w => w._id === query._id) || null;
    }
    return null;
  }

  async findById(id) {
    return this.workspaces.get(id) || null;
  }

  async create(data) {
    const id = 'ws_' + Math.random().toString(36).substring(2, 10);
    const now = new Date();
    const doc = {
      _id: id,
      ...data,
      shareCode: data.shareCode || 'SYNC-' + Math.floor(1000 + Math.random() * 9000),
      tags: data.tags || ['AI', 'Research'],
      createdAt: now,
      updatedAt: now,
    };
    this.workspaces.set(id, doc);
    return doc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const doc = this.workspaces.get(id);
    if (!doc) return null;
    const updated = {
      ...doc,
      ...(update.$set || update),
      updatedAt: new Date()
    };
    this.workspaces.set(id, updated);
    return updated;
  }

  async findByIdAndDelete(id) {
    const doc = this.workspaces.get(id);
    if (doc) {
      this.workspaces.delete(id);
      return doc;
    }
    return null;
  }
}

const memoryStore = new InMemoryWorkspaceStore();

module.exports = {
  WorkspaceModel: MongooseModel,
  InMemoryWorkspaceStore: memoryStore,
  getStore: (isMongoConnected) => (isMongoConnected ? MongooseModel : memoryStore)
};
