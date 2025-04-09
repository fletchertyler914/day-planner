'use client';

import { useState, useEffect } from 'react';
import { Chat } from '@/lib/chat';
import {
  CalendarIcon,
  ChevronLeftIcon,
  MenuIcon,
  PlusIcon,
  TrashIcon,
} from './icons';
import { useTheme } from 'next-themes';
import { ApiKeyInput } from './api-key-input';

interface SideMenuProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onClearAllChats: () => Promise<void>;
}

export function SideMenu({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onClearAllChats,
}: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await onDeleteChat(chatId);
    if (chatId === currentChatId && chats.length > 0) {
      handleChatSelect(chats[0].id);
    } else if (chats.length === 0) {
      onNewChat();
    }
  };

  // Sort chats by date, newest first
  const sortedChats = [...chats].sort(
    (a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Menu Toggle Button (both mobile and desktop) */}
      <button
        onClick={toggleMenu}
        className={`fixed top-4 ${
          isOpen ? 'left-[16.5rem] sm:left-[19.5rem]' : 'left-4'
        } z-50 p-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border hover:bg-accent transition-all duration-200 ease-in-out`}
      >
        {isOpen ? (
          <ChevronLeftIcon size={20} className='text-foreground' />
        ) : (
          <MenuIcon size={20} className='text-foreground' />
        )}
      </button>

      {/* Side Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-80 bg-background border-r border-border transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Header with New Chat */}
          <div className='flex items-center justify-between p-4 border-b border-border'>
            <div className='flex items-center gap-2'>
              <CalendarIcon size={20} className='text-primary' />
              <h2 className='text-lg font-semibold text-foreground'>
                Day Plans
              </h2>
            </div>
            <button
              onClick={onNewChat}
              className='p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
              title='New Chat'
            >
              <PlusIcon size={20} />
            </button>
          </div>

          {/* Chat List */}
          <div className='flex-1 overflow-y-auto py-2 px-2 space-y-1'>
            {sortedChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`group w-full text-left p-3 rounded-lg transition-colors ${
                  chat.id === currentChatId
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1 min-w-0'>
                    <div className='text-sm font-medium truncate'>
                      {chat.messages[0]?.content || 'New Chat'}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {new Date(chat.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    className='opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all'
                    title='Delete Chat'
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with Theme Toggle and Clear All */}
          <div className='border-t border-border p-4 space-y-4'>
            <ApiKeyInput />
            {mounted && (
              <div className='flex items-center justify-between px-2'>
                <span className='text-sm text-muted-foreground'>Theme</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className='relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-accent'
                  role='switch'
                  aria-checked={theme === 'dark'}
                >
                  <span
                    className={`${
                      theme === 'dark'
                        ? 'translate-x-6 bg-primary'
                        : 'translate-x-1 bg-muted-foreground'
                    } inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out`}
                  />
                </button>
              </div>
            )}
            {chats.length > 0 && (
              <button
                onClick={onClearAllChats}
                className='w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
              >
                <TrashIcon size={16} />
                Clear All Chats
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile and desktop */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className='fixed inset-0 z-30 bg-black/50 backdrop-blur-sm'
        />
      )}
    </>
  );
}
