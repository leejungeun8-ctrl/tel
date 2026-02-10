
export interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
}

export interface Recipient {
  id: string; // This is the Telegram Chat ID
  name: string;
  avatar: string;
  lastMessage?: string;
  lastTime?: string;
  unreadCount?: number;
  isPinned?: boolean;
}

export interface BotInfo {
  id: number;
  first_name: string;
  username: string;
}

export interface BotConfig {
  botToken: string;
  botInfo?: BotInfo;
}

export type AppState = {
  botConfig: BotConfig;
  recipients: Recipient[];
  messages: Record<string, Message[]>;
  activeRecipientId: string | null;
};
