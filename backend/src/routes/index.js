const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getProfile, updateAiPreferences } = require('../controllers/userController');
const { createWorkspace, listWorkspaces, getWorkspaceById, updateMilestoneStatus } = require('../controllers/workspaceController');
const { generatePairingCode, sendNudge } = require('../controllers/botController');

const router = express.Router();

// Apply auth middleware to all /api/v1 routes
router.use(requireAuth);

// 1. GET /api/v1/user/profile
router.get('/user/profile', getProfile);

// 2. PUT /api/v1/user/profile/ai-preferences
router.put('/user/profile/ai-preferences', updateAiPreferences);

// 3. POST /api/v1/workspaces
router.post('/workspaces', createWorkspace);

// 4. GET /api/v1/workspaces
router.get('/workspaces', listWorkspaces);

// 5. GET /api/v1/workspaces/:workspaceId
router.get('/workspaces/:workspaceId', getWorkspaceById);

// 6. PATCH /api/v1/workspaces/:workspaceId/milestones/:milestoneId
router.patch('/workspaces/:workspaceId/milestones/:milestoneId', updateMilestoneStatus);

// 7. POST /api/v1/bot/generate-pairing-code
router.post('/bot/generate-pairing-code', generatePairingCode);

// 8. POST /api/v1/bot/send-nudge
router.post('/bot/send-nudge', sendNudge);

module.exports = router;
