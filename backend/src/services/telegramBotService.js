import TelegramBot from 'node-telegram-bot-api';
import { firestoreService } from './firestoreService.js';

let bot = null;

export function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token.includes('7123456789:AAE') || token.includes('sample')) {
    console.log('ℹ️ Telegram Bot Token missing or set to sample. Operating in mock Telegram bot mode.');
    return;
  }

  try {
    bot = new TelegramBot(token, { polling: true });
    console.log('🤖 Telegram Bot initialized with live polling (Username: synapse_ai_copilot_bot)');

    // Deep-link pairing handler: /start 849201
    bot.onText(/\/start (.+)/, async (msg, match) => {
      const chatId = String(msg.chat.id);
      const pairingCode = match[1];

      try {
        const userDoc = await firestoreService.findUserByPairingCode(pairingCode);
        if (userDoc) {
          await firestoreService.saveUserProfile(userDoc.uid, {
            'companionSettings.telegramChatId': chatId,
            telegramPairingCode: null
          });
          bot.sendMessage(chatId, "🎉 Successfully connected Synapse.AI! You will receive project updates and AI nudges here.");
        } else {
          bot.sendMessage(chatId, "❌ Invalid pairing code. Generate a new link from your Synapse Settings.");
        }
      } catch (err) {
        console.error('Error handling Telegram pairing code:', err);
        bot.sendMessage(chatId, "❌ Error processing pairing request. Please try again.");
      }
    });

    // On-the-go Q&A handler
    bot.on('message', async (msg) => {
      if (!msg.text || msg.text.startsWith('/start')) return;
      const chatId = String(msg.chat.id);
      bot.sendMessage(chatId, `🧠 Synapse AI received your question: "${msg.text}". Processing response...`);
    });
  } catch (err) {
    console.warn('⚠️ Telegram bot initialization warning:', err.message);
  }
}

export async function sendTelegramNudge(chatId, messageText) {
  if (bot && chatId) {
    await bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
    return true;
  }
  console.log(`[MOCK TELEGRAM NUDGE] To ChatId (${chatId}): ${messageText}`);
  return true;
}
