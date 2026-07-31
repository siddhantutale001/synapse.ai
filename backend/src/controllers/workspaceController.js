import { firestoreService } from '../services/firestoreService.js';
import { executeAiPipeline } from '../services/insightsAiService.js';

/**
 * POST /api/v1/workspaces
 */
export const createWorkspace = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { title, rawIdea } = req.body;

    if (!title || !rawIdea) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Both title and rawIdea are required fields.'
        }
      });
    }

    const workspaceId = `ws_${Math.random().toString(36).substring(2, 10)}`;
    const createdAt = new Date().toISOString();

    const newWorkspace = {
      workspaceId,
      ownerId: userId,
      title,
      rawIdea,
      status: 'RESEARCHING',
      createdAt
    };

    await firestoreService.saveWorkspace(workspaceId, newWorkspace);

    const userDoc = await firestoreService.getUserProfile(userId);
    const userPreferences = userDoc?.geminiAiPreferences || {};

    // Asynchronously trigger iNSIGHTS pipeline
    executeAiPipeline(workspaceId, rawIdea, userPreferences);

    res.status(202).json({
      success: true,
      workspaceId,
      status: 'RESEARCHING',
      message: `Pipeline initiated. Client should subscribe to Firestore document workspaces/${workspaceId}.`
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/workspaces
 */
export const listWorkspaces = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const workspaces = await firestoreService.getWorkspacesByOwner(userId);

    const formattedData = workspaces.map(ws => ({
      workspaceId: ws.workspaceId,
      title: ws.title,
      rawIdea: ws.rawIdea,
      status: ws.status
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/workspaces/:workspaceId
 */
export const getWorkspaceById = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await firestoreService.getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Workspace with ID '${workspaceId}' was not found.`
        }
      });
    }

    res.status(200).json({
      success: true,
      data: workspace
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/workspaces/:workspaceId/milestones/:milestoneId
 */
export const updateMilestoneStatus = async (req, res, next) => {
  try {
    const { workspaceId, milestoneId } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: `Field status is required and must be one of: ${validStatuses.join(', ')}.`
        }
      });
    }

    const workspace = await firestoreService.getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Workspace with ID '${workspaceId}' was not found.`
        }
      });
    }

    if (!workspace.projectHub || !Array.isArray(workspace.projectHub.milestones)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Workspace does not contain any projectHub milestones yet.'
        }
      });
    }

    let milestoneFound = false;
    const updatedMilestones = workspace.projectHub.milestones.map(m => {
      if (m.id === milestoneId) {
        milestoneFound = true;
        return { ...m, status };
      }
      return m;
    });

    if (!milestoneFound) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Milestone with ID '${milestoneId}' was not found in workspace '${workspaceId}'.`
        }
      });
    }

    const updatedWorkspace = {
      ...workspace,
      projectHub: {
        ...workspace.projectHub,
        milestones: updatedMilestones
      }
    };

    await firestoreService.saveWorkspace(workspaceId, updatedWorkspace);

    res.status(200).json({
      success: true,
      workspaceId,
      milestoneId,
      updatedStatus: status
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/workspaces/:workspaceId
 */
export const deleteWorkspace = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    await firestoreService.deleteWorkspace(workspaceId);
    res.status(200).json({
      success: true,
      workspaceId,
      message: `Workspace '${workspaceId}' deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
