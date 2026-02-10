
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { ChatWindow } from './components/ChatWindow.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { AppState, Recipient, Message, BotConfig } from './types.ts';
import { sendTelegramMessage } from './services/telegramService.ts';

const DEFAULT_RECIPIENTS: Recipient[] = [
  { id: '12345678', name: 'Dev Support', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', lastMessage: 'System: Ready', lastTime: 'now', isPinned: true },
  { id: '23456789', name: 'Eva Summer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eva', lastMessage: 'Waiting for bot...', lastTime: '11:28 PM', unreadCount: 0 },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('tg_bot_commander_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          activeRecipientId: parsed.activeRecipientId || (parsed.recipients[0]?.id || null),
        };
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    return {
      botConfig: { botToken: '' },
      recipients: DEFAULT_RECIPIENTS,
      messages: {},
      activeRecipientId: DEFAULT_RECIPIENTS[0]?.id || null,
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('tg_bot_commander_v2', JSON.stringify(state));
  }, [state]);

  const handleSendMessage = async (text: string) => {
    if (!state.activeRecipientId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    // Update local state immediately for UI responsiveness
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [prev.activeRecipientId!]: [...(prev.messages[prev.activeRecipientId!] || []), newMessage],
      },
      recipients: prev.recipients.map(r => 
        r.id === prev.activeRecipientId 
          ? { ...r, lastMessage: text, lastTime: newMessage.timestamp } 
          : r
      )
    }));

    // Actually send via Telegram if token exists
    if (state.botConfig.botToken) {
      try {
        await sendTelegramMessage(state.botConfig, state.activeRecipientId, text);
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [prev.activeRecipientId!]: (prev.messages[prev.activeRecipientId!] || []).map(m => 
              m.id === newMessage.id ? { ...m, status: 'delivered' } : m
            ),
          }
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [prev.activeRecipientId!]: (prev.messages[prev.activeRecipientId!] || []).map(m => 
              m.id === newMessage.id ? { ...m, status: 'error' } : m
            ),
          }
        }));
      }
    }
  };

  const updateBotConfig = (config: BotConfig) => {
    setState(prev => ({ ...prev, botConfig: config }));
  };

  const addRecipient = (recipient: Recipient) => {
    setState(prev => ({
      ...prev,
      recipients: [recipient, ...prev.recipients],
      activeRecipientId: recipient.id
    }));
  };

  const removeRecipient = (id: string) => {
    setState(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== id),
      activeRecipientId: prev.activeRecipientId === id ? (prev.recipients.find(r => r.id !== id)?.id || null) : prev.activeRecipientId
    }));
  };

  const selectRecipient = (id: string) => {
    setState(prev => ({ ...prev, activeRecipientId: id }));
  };

  const activeRecipient = state.recipients.find(r => r.id === state.activeRecipientId) || null;

  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900">
      <Sidebar 
        recipients={state.recipients} 
        activeId={state.activeRecipientId} 
        onSelect={selectRecipient}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <ChatWindow 
        recipient={activeRecipient} 
        messages={state.activeRecipientId ? (state.messages[state.activeRecipientId] || []) : []}
        onSendMessage={handleSendMessage}
        botConfigured={!!state.botConfig.botToken}
      />
      {isSettingsOpen && (
        <SettingsModal 
          config={state.botConfig}
          recipients={state.recipients}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateConfig={updateBotConfig}
          onAddRecipient={addRecipient}
          onRemoveRecipient={removeRecipient}
        />
      )}
    </div>
  );
};

export default App;
