// Twilio WhatsApp functionality removed as requested
export async function sendWhatsAppNudge(targetPhone, messageText) {
  console.log(`[WHATSAPP DISABLED] Nudge notice to (${targetPhone}): ${messageText}`);
  return { success: false, error: "WhatsApp messaging has been removed." };
}
