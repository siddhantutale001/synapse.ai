const { dbStore } = require('../config/firebase');

/**
 * 1. GET /api/v1/user/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const userDoc = await dbStore.getUser(userId);

    if (!userDoc) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `User profile for ID '${userId}' was not found.`
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        uid: userDoc.uid,
        displayName: userDoc.displayName || 'Alex Chen',
        academic: userDoc.academic || { college: "JSPM's Rajarshi Shahu College of Engineering", major: "Computer Engineering" },
        geminiAiPreferences: userDoc.geminiAiPreferences || { personaMode: "HACKATHON_SPRINT", aboutUser: "3rd year CS student." }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. PUT /api/v1/user/profile/ai-preferences
 */
const updateAiPreferences = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { aboutUser, personaMode, preferredLanguages, preferredFrontend, preferredBackend, preferredDatabase } = req.body;

    if (!personaMode) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Field personaMode is required.'
        }
      });
    }

    const validModes = ['HACKATHON_SPRINT', 'ACADEMIC_RESEARCH', 'ELI5_BEGINNER', 'ENTERPRISE_ARCHITECT'];
    if (!validModes.includes(personaMode)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: `Invalid personaMode '${personaMode}'. Must be one of: ${validModes.join(', ')}.`
        }
      });
    }

    const newPreferences = {
      aboutUser: aboutUser || '',
      personaMode,
      preferredLanguages: preferredLanguages || ['Python', 'TypeScript'],
      preferredFrontend: preferredFrontend || 'React',
      preferredBackend: preferredBackend || 'Express',
      preferredDatabase: preferredDatabase || 'Firebase'
    };

    await dbStore.setUser(userId, { geminiAiPreferences: newPreferences });

    res.status(200).json({
      success: true,
      message: 'Gemini AI preferences saved successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateAiPreferences
};
