import express from 'express';
import { protectRoute } from '../middlewares/clerkAuth.js';
import { getProfile, updateAiPreferences, updateAcademicProfile, deleteUserProfile } from '../controllers/profileController.js';

const router = express.Router();

router.use(protectRoute);

router.get('/profile', getProfile);
router.put('/profile/ai-preferences', updateAiPreferences);
router.put('/profile/academic', updateAcademicProfile);
router.delete('/profile', deleteUserProfile);

export default router;
