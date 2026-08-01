import { firestoreService } from '../services/firestoreService.js';

/**
 * 1. GET /api/v1/user/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    let userDoc = await firestoreService.getUserProfile(userId);

    if (!userDoc) {
      return res.status(200).json({
        success: true,
        data: {
          uid: userId,
          isProfileComplete: false,
          displayName: '',
          email: '',
          academic: {
            college: '',
            major: '',
            yearOfStudy: '1st Year',
            developerRole: '',
            githubUrl: '',
            linkedinUrl: ''
          },
          geminiAiPreferences: {
            aboutUser: '',
            personaMode: 'HACKATHON_SPRINT',
            preferredLanguages: ['Python', 'TypeScript'],
            preferredFrontend: 'React',
            preferredBackend: 'Express',
            preferredDatabase: 'Firebase'
          }
        }
      });
    }

    const isComplete = userDoc.isProfileComplete === true || Boolean(userDoc.displayName || userDoc.academic?.college || userDoc.academic?.major);

    res.status(200).json({
      success: true,
      data: {
        ...userDoc,
        uid: userDoc.uid || userId,
        isProfileComplete: isComplete
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 2. PUT /api/v1/user/profile/ai-preferences
 */
export const updateAiPreferences = async (req, res, next) => {
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

    const updatedPreferences = {
      aboutUser: aboutUser || '',
      personaMode,
      preferredLanguages: preferredLanguages || ['Python', 'TypeScript'],
      preferredFrontend: preferredFrontend || 'React',
      preferredBackend: preferredBackend || 'Express',
      preferredDatabase: preferredDatabase || 'Firebase'
    };

    await firestoreService.saveUserProfile(userId, { 
      geminiAiPreferences: updatedPreferences,
      isProfileComplete: true,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Gemini AI preferences saved successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 3. PUT /api/v1/user/profile/academic
 */
export const updateAcademicProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { displayName, email, college, major, yearOfStudy, developerRole, githubUrl, linkedinUrl } = req.body;

    const updatedAcademic = {
      college: college || '',
      major: major || '',
      yearOfStudy: yearOfStudy || '1st Year',
      developerRole: developerRole || '',
      githubUrl: githubUrl || '',
      linkedinUrl: linkedinUrl || ''
    };

    const profileData = {
      uid: userId,
      displayName: displayName || req.body.displayName || '',
      email: email || '',
      academic: updatedAcademic,
      isProfileComplete: true,
      updatedAt: new Date().toISOString()
    };

    await firestoreService.saveUserProfile(userId, profileData);

    res.status(200).json({
      success: true,
      data: profileData,
      message: 'Academic profile saved successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 4. DELETE /api/v1/user/profile
 */
export const deleteUserProfile = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    await firestoreService.deleteUserProfile(userId);
    res.status(200).json({
      success: true,
      message: `Profile and workspaces for user '${userId}' deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};
