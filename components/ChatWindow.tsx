
import React, { useState, useRef, useEffect } from 'react';
import { Recipient, Message } from '../types';

interface ChatWindowProps {
  recipient: Recipient | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  botConfigured: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ recipient, messages, onSendMessage, botConfigured }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!recipient) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#8fb394] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
        <div className="bg-black/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold z-10 shadow-xl border border-white/10">
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative bg-[#e7ebf0]">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/telegram-pattern.png')" }}></div>

      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-6 z-20 shadow-sm">
        <div className="flex items-center space-x-4">
          <img src={recipient.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-900 text-base tracking-tight leading-tight">{recipient.name}</h2>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-gray-400">
          <button className="hover:text-[#3390ec] transition-colors"><i className="fas fa-phone-alt"></i></button>
          <button className="hover:text-[#3390ec] transition-colors"><i className="fas fa-video"></i></button>
          <button className="hover:text-[#3390ec] transition-colors"><i className="fas fa-search"></i></button>
          <button className="hover:text-[#3390ec] transition-colors"><i className="fas fa-ellipsis-v"></i></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col space-y-3 z-10 relative custom-scrollbar">
        <div className="flex justify-center mb-6">
          <span className="bg-black/10 backdrop-blur-sm text-gray-600 text-[11px] px-4 py-1 rounded-full font-bold shadow-sm">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Message groups could be implemented here */}
        {messages.length === 0 && (
          <div className="flex justify-center mt-10">
            <div className="bg-white/60 backdrop-blur-md p-4 rounded-3xl text-center max-w-xs shadow-sm border border-white">
              <p className="text-xs text-gray-500 font-medium italic">No messages yet. Start the conversation via your Bot!</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex group ${msg.sender === 'bot' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`relative max-w-[80%] p-3 rounded-2xl shadow-sm ${
              msg.sender === 'bot' 
                ? 'bg-[#effdde] rounded-tr-none text-right' 
                : 'bg-white rounded-tl-none text-left'
            }`}>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className={`flex items-center space-x-1.5 mt-1 ${msg.sender === 'bot' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] text-gray-400 font-medium uppercase">{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <span className="text-[10px]">
                    {msg.status === 'sent' && <i className="fas fa-clock text-gray-300"></i>}
                    {(msg.status === 'delivered' || msg.status === 'read') && (
                      <i className={`fas fa-check-double ${msg.status === 'read' ? 'text-[#3390ec]' : 'text-[#4fae4e]'}`}></i>
                    )}
                    {msg.status === 'error' && <i className="fas fa-exclamation-circle text-red-500"></i>}
                  </span>
                )}
              </div>
              
              {/* Message tail implementation */}
              <div className={`absolute top-0 w-4 h-4 ${
                msg.sender === 'bot' 
                  ? 'right-[-8px] text-[#effdde]' 
                  : 'left-[-8px] text-white'
              }`}>
                <svg viewBox="0 0 16 16" fill="currentColor">
                  {msg.sender === 'bot' 
                    ? <path d="M0 0h16L0 16V0z"/> 
                    : <path d="M16 0H0l16 16V0z"/>}
                </svg>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 z-20 flex items-center justify-center bg-white/50 backdrop-blur-md">
        <div className="max-w-4xl w-full flex items-center space-x-3">
          <div className="flex-1 bg-white rounded-[24px] shadow-lg flex items-center px-5 py-3 border border-transparent focus-within:border-[#3390ec] transition-all">
            <button className="text-gray-400 hover:text-[#3390ec] transition-colors">
              <i className="far fa-smile text-xl"></i>
            </button>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message" 
              className="flex-1 mx-4 text-sm bg-transparent resize-none h-6 focus:outline-none placeholder-gray-400 scrollbar-hide"
            />
            <button className="text-gray-400 hover:text-[#3390ec] transition-colors">
              <i className="fas fa-paperclip text-xl"></i>
            </button>
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all transform active:scale-95 ${
              inputText.trim() 
                ? 'bg-[#3390ec] hover:bg-[#2b7bc9] hover:shadow-[#3390ec]/30' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <i className={`fas ${inputText.trim() ? 'fa-paper-plane' : 'fa-microphone'} text-xl`}></i>
          </button>
        </div>
      </div>
      
      {!botConfigured && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-full flex justify-center px-4">
          <div className="bg-red-500 text-white text-[11px] px-6 py-2 rounded-full shadow-2xl font-black tracking-widest uppercase border-2 border-white/20 animate-pulse">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Configure Bot Token in Settings
          </div>
        </div>
      )}
    </div>
  );
};
