import express from 'express';
import { protectRoute } from '../middlewares/clerkAuth.js';
import { createWorkspace, listWorkspaces, getWorkspaceById, updateMilestoneStatus, deleteWorkspace } from '../controllers/workspaceController.js';

const router = express.Router();

router.use(protectRoute);

router.post('/', createWorkspace);
router.get('/', listWorkspaces);
router.get('/:workspaceId', getWorkspaceById);
router.patch('/:workspaceId/milestones/:milestoneId', updateMilestoneStatus);
router.delete('/:workspaceId', deleteWorkspace);

export default router;
