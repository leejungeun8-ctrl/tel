
import React from 'react';
import { Recipient } from '../types';

interface SidebarProps {
  recipients: Recipient[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ recipients, activeId, onSelect, onOpenSettings }) => {
  return (
    <div className="w-[350px] bg-white border-r flex flex-col h-full flex-shrink-0">
      {/* Header & Search */}
      <div className="p-3 flex items-center space-x-3">
        <button 
          onClick={onOpenSettings}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <i className="fas fa-bars text-lg"></i>
        </button>
        <div className="flex-1 relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#3390ec]"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {recipients.map((recipient) => (
          <div 
            key={recipient.id}
            onClick={() => onSelect(recipient.id)}
            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${activeId === recipient.id ? 'bg-[#3390ec] text-white hover:bg-[#3390ec]' : ''}`}
          >
            <div className="relative">
              <img 
                src={recipient.avatar} 
                alt={recipient.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className={`font-medium truncate ${activeId === recipient.id ? 'text-white' : 'text-gray-900'}`}>
                  {recipient.isPinned && <i className="fas fa-thumbtack text-xs mr-1 opacity-50"></i>}
                  {recipient.name}
                </h3>
                <span className={`text-xs ${activeId === recipient.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {recipient.lastTime}
                </span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className={`text-sm truncate ${activeId === recipient.id ? 'text-white/90' : 'text-gray-500'}`}>
                  {recipient.lastMessage}
                </p>
                {recipient.unreadCount && recipient.unreadCount > 0 && activeId !== recipient.id && (
                  <span className="bg-[#c4c9cc] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {recipient.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
