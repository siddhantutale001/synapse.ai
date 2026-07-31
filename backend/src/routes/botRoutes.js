import express from 'express';
import { protectRoute } from '../middlewares/clerkAuth.js';
import { generatePairingCode, sendNudge } from '../controllers/botController.js';

const router = express.Router();

// Protected Bot Endpoints (Requires Clerk JWT Authorization header)
router.use(protectRoute);

router.post('/generate-pairing-code', generatePairingCode);
router.post('/send-nudge', sendNudge);

export default router;
