
import React, { useState } from 'react';
import { BotConfig, Recipient, BotInfo } from '../types';
import { getBotInfo } from '../services/telegramService';

interface SettingsModalProps {
  config: BotConfig;
  recipients: Recipient[];
  onClose: () => void;
  onUpdateConfig: (config: BotConfig) => void;
  onAddRecipient: (recipient: Recipient) => void;
  onRemoveRecipient: (id: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  config, recipients, onClose, onUpdateConfig, onAddRecipient, onRemoveRecipient 
}) => {
  const [token, setToken] = useState(config.botToken);
  const [isVerifying, setIsVerifying] = useState(false);
  const [newChatId, setNewChatId] = useState('');
  const [newName, setNewName] = useState('');

  const handleVerifyToken = async () => {
    if (!token.trim()) return;
    setIsVerifying(true);
    try {
      const info: BotInfo = await getBotInfo(token);
      onUpdateConfig({ botToken: token, botInfo: info });
      alert(`Success! Connected to @${info.username}`);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddRecipient = () => {
    if (newChatId.trim() && newName.trim()) {
      onAddRecipient({
        id: newChatId.trim(),
        name: newName.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newChatId}`,
        lastMessage: 'Contact added',
        lastTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setNewChatId('');
      setNewName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#3390ec] p-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center space-x-3">
            <i className="fas fa-robot text-xl"></i>
            <div>
              <h2 className="font-bold text-lg leading-tight">Bot Configuration</h2>
              <p className="text-xs text-white/80">Manage your Telegram Bot API connection</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Bot Token Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3390ec] uppercase tracking-widest">Connection Settings</h3>
              {config.botInfo && (
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  CONNECTED
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Bot Token (API ID)</label>
                <div className="flex space-x-2">
                  <input 
                    type="password" 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="123456789:ABCDefgh..." 
                    className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3390ec] transition-all"
                  />
                  <button 
                    onClick={handleVerifyToken}
                    disabled={isVerifying || !token}
                    className="bg-[#3390ec] text-white px-6 rounded-xl text-sm font-bold shadow-md hover:bg-[#2b7bc9] disabled:opacity-50 transition-all flex items-center space-x-2"
                  >
                    {isVerifying ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-plug"></i>}
                    <span>{isVerifying ? 'Verifying...' : 'Connect'}</span>
                  </button>
                </div>
              </div>

              {config.botInfo && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#3390ec] rounded-full flex items-center justify-center text-white font-bold">
                    {config.botInfo.first_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-blue-900 truncate">{config.botInfo.first_name}</p>
                    <p className="text-xs text-blue-600 truncate">@{config.botInfo.username}</p>
                  </div>
                  <div className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ID: {config.botInfo.id}
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Manage Recipients Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#3390ec] uppercase tracking-widest">Manage Recipients</h3>
            
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl mb-4">
              <p className="text-[11px] text-amber-800 leading-normal">
                <i className="fas fa-lightbulb mr-1"></i>
                <strong>Important:</strong> To avoid "Chat Not Found" errors, the recipient <strong>must</strong> have sent a message (or clicked <code>/start</code>) to your bot first. You can find your own Chat ID using <code>@userinfobot</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
               {recipients.map(r => (
                 <div key={r.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 p-3 rounded-2xl group hover:border-[#3390ec]/30 transition-all">
                   <div className="flex items-center space-x-3 overflow-hidden">
                     <img src={r.avatar} className="w-9 h-9 rounded-full bg-white border border-gray-200" />
                     <div className="truncate">
                        <p className="text-sm font-bold text-gray-800 truncate">{r.name}</p>
                        <p className="text-[10px] font-mono text-gray-400">Chat ID: {r.id}</p>
                     </div>
                   </div>
                   <button 
                    onClick={() => onRemoveRecipient(r.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                   >
                     <i className="fas fa-trash-alt text-xs"></i>
                   </button>
                 </div>
               ))}
            </div>

            <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 p-4 rounded-3xl space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center">
                <i className="fas fa-plus-circle mr-2"></i>
                Add New Contact
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="Recipient Name" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border-2 border-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3390ec]/30 bg-white"
                />
                <input 
                  type="text" 
                  placeholder="Telegram Chat ID" 
                  value={newChatId}
                  onChange={(e) => setNewChatId(e.target.value)}
                  className="w-full border-2 border-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3390ec]/30 bg-white"
                />
              </div>
              <button 
                onClick={handleAddRecipient}
                disabled={!newName || !newChatId}
                className="w-full bg-white text-[#3390ec] border-2 border-[#3390ec] py-2 rounded-xl text-sm font-bold hover:bg-[#3390ec] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#3390ec] transition-all"
              >
                Add Recipient
              </button>
            </div>
          </section>
        </div>

        <div className="p-4 bg-gray-50 text-[10px] text-gray-400 text-center flex items-center justify-center space-x-2 border-t shrink-0">
          <i className="fas fa-shield-alt"></i>
          <span>Data is stored locally in your browser cache. Secure connection to api.telegram.org</span>
        </div>
      </div>
    </div>
  );
};
