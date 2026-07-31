const TelegramBot = require('node-telegram-bot-api');
const twilio = require('twilio');
const { dbStore } = require('../config/firebase');

let telegramBot = null;
let twilioClient = null;

if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'sample_telegram_bot_token') {
  try {
    telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('🤖 Telegram Bot API initialized successfully');

    telegramBot.onText(/\/start (.+)/, async (msg, match) => {
      const pairingCode = match[1];
      const chatId = msg.chat.id.toString();

      const pairData = await dbStore.getPairingCode(pairingCode);
      if (pairData) {
        await dbStore.setUser(pairData.userId, {
          companionSettings: {
            telegramChatId: chatId
          }
        });
        telegramBot.sendMessage(chatId, `🎉 Successfully paired with Synapse.AI for account user ID: ${pairData.userId}`);
      } else {
        telegramBot.sendMessage(chatId, `❌ Invalid or expired pairing code: ${pairingCode}`);
      }
    });
  } catch (err) {
    console.warn('⚠️ Telegram bot initialization notice:', err.message);
  }
}

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'sample_twilio_sid') {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('📱 Twilio WhatsApp API initialized successfully');
  } catch (err) {
    console.warn('⚠️ Twilio initialization notice:', err.message);
  }
}

const sendTelegramMessage = async (chatId, message) => {
  if (telegramBot) {
    await telegramBot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    return true;
  }
  console.log(`[MOCK TELEGRAM DISPATCH] To ChatId (${chatId}): ${message}`);
  return true;
};

const sendWhatsAppMessage = async (toPhone, message) => {
  if (twilioClient) {
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
      to: `whatsapp:${toPhone}`,
      body: message
    });
    return true;
  }
  console.log(`[MOCK WHATSAPP DISPATCH] To Phone (${toPhone}): ${message}`);
  return true;
};

module.exports = {
  sendTelegramMessage,
  sendWhatsAppMessage
};
