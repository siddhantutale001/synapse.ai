import { firestoreService } from '../services/firestoreService.js';
import { sendTelegramNudge } from '../services/telegramBotService.js';

/**
 * POST /api/v1/bot/generate-pairing-code
 */
export const generatePairingCode = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const pairingCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save telegramPairingCode in Firestore users/{clerkUserId}
    await firestoreService.saveUserProfile(userId, {
      telegramPairingCode: pairingCode,
      pairingCodeCreatedAt: new Date().toISOString()
    });

    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'synapse_ai_copilot_bot';
    const telegramDeepLink = `https://t.me/${botUsername}?start=${pairingCode}`;

    res.status(200).json({
      success: true,
      pairingCode,
      telegramDeepLink
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/bot/send-nudge
 */
export const sendNudge = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { workspaceId, message } = req.body;

    if (!workspaceId || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'workspaceId and message are required fields.'
        }
      });
    }

    const userDoc = await firestoreService.getUserProfile(userId);
    const companionSettings = userDoc?.companionSettings || {};

    const chatId = companionSettings.telegramChatId || '123456789';
    const delivered = await sendTelegramNudge(chatId, message);

    res.status(200).json({
      success: true,
      delivered
    });
  } catch (err) {
    next(err);
  }
};
