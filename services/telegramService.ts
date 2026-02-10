
import { BotConfig } from '../types';

/**
 * Verifies the bot token and returns bot information
 */
export const getBotInfo = async (token: string) => {
  if (!token) throw new Error('Token is required');
  const url = `https://api.telegram.org/bot${token}/getMe`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.ok) throw new Error(data.description || 'Invalid token');
    return data.result;
  } catch (error) {
    console.error('Telegram API Error (getMe):', error);
    throw error;
  }
};

/**
 * Sends a message via the Telegram Bot API
 */
export const sendTelegramMessage = async (
  botConfig: BotConfig,
  chatId: string,
  text: string
) => {
  if (!botConfig.botToken) {
    throw new Error('Bot token is not configured');
  }

  const url = `https://api.telegram.org/bot${botConfig.botToken}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      if (data.description === 'Bad Request: chat not found') {
        throw new Error('Chat Not Found: The recipient must start a chat with the bot first.');
      }
      throw new Error(data.description || 'Failed to send message');
    }

    return data.result;
  } catch (error: any) {
    console.error('Telegram API Error (sendMessage):', error);
    throw error;
  }
};
