'use client';

import { useRef, useEffect, useState } from 'react';
import { Message } from '@/components/message';
import { useScrollToBottom } from '@/components/use-scroll-to-bottom';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, SparklesIcon } from '@/components/icons';
import { useChat } from 'ai/react';
import {
  getCurrentChatId,
  saveChat,
  createNewChat,
  getChats,
  Chat,
} from '@/lib/chat';
import { SideMenu } from '@/components/side-menu';

const suggestedActions = [
  {
    title: 'Plan My Workday',
    label: 'Schedule meetings, deep work, and breaks',
    action:
      'I need to plan my workday. I have a team meeting at 2pm, need to prepare a presentation, and want to do some deep work on a project. I also need to take a lunch break and some short breaks throughout the day.',
  },
  {
    title: 'Plan My Weekend',
    label: 'Balance chores, relaxation, and social activities',
    action:
      'I want to plan my Saturday. I need to do laundry, go grocery shopping, meet friends for brunch, and have some time to relax. I also want to go for a run and read a book.',
  },
  {
    title: 'Plan My Study Day',
    label: 'Organize study sessions, breaks, and review time',
    action:
      'I need to plan my study day. I have three subjects to review: math, history, and biology. I want to include breaks and some exercise. I study best in the morning and need to finish by 6pm.',
  },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const { messages, handleSubmit, input, setInput, append, setMessages } =
    useChat({
      id: currentChatId || undefined,
    });

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setCurrentChatId(getCurrentChatId());
    setChats(getChats());
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isClient && currentChatId) {
      const chat = {
        id: currentChatId,
        messages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveChat(chat);
      setChats(getChats());
    }
  }, [messages, currentChatId, isClient]);

  // Load initial messages if there's a current chat
  useEffect(() => {
    if (isClient && currentChatId) {
      const chats = getChats();
      const chat = chats.find((c) => c.id === currentChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    }
  }, [currentChatId, setMessages, isClient]);

  const handleNewChat = () => {
    if (!isClient) return;
    const newChat = createNewChat();
    setCurrentChatId(newChat.id);
    setMessages([]);
    setInput('');
    setChats(getChats());
  };

  const handleChatSelect = (chatId: string) => {
    if (!isClient) return;
    setCurrentChatId(chatId);
    setInput('');
    // Load messages for the selected chat
    const chats = getChats();
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
  };

  const handleSubmitWithChat = (e: React.FormEvent) => {
    if (!isClient) return;
    if (!currentChatId) {
      const newChat = createNewChat();
      setCurrentChatId(newChat.id);
      setChats(getChats());
    }
    handleSubmit(e);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className='flex h-dvh bg-background'>
      {/* Side Menu */}
      <SideMenu
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className='flex-1 flex flex-col h-full relative'>
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className='flex-1 overflow-y-auto pb-36'
        >
          <div className='max-w-3xl mx-auto px-4 py-4'>
            {messages.length === 0 ? (
              <div className='mt-12 space-y-8'>
                <motion.div className='flex flex-col items-center justify-center'>
                  <div className='w-full max-w-2xl border rounded-2xl p-8 flex flex-col items-center gap-6 text-muted-foreground text-sm border-border bg-card'>
                    <div className='flex items-center gap-3'>
                      <CalendarIcon size={28} className='text-primary' />
                      <h2 className='text-2xl font-semibold text-foreground'>
                        Smart Day Planner
                      </h2>
                    </div>

                    <p className='text-lg text-foreground text-center max-w-lg'>
                      Let me help you organize your day in the most effective
                      way possible.
                    </p>

                    <div className='w-full max-w-md space-y-3'>
                      <div className='flex items-center gap-3 p-3 rounded-lg bg-accent'>
                        <SparklesIcon
                          size={20}
                          className='text-primary flex-shrink-0'
                        />
                        <span className='text-foreground'>
                          AI-powered scheduling that considers your energy
                          levels and task types
                        </span>
                      </div>
                      <div className='flex items-center gap-3 p-3 rounded-lg bg-accent'>
                        <ClockIcon
                          size={20}
                          className='text-primary flex-shrink-0'
                        />
                        <span className='text-foreground'>
                          Smart time allocation with built-in breaks and
                          transitions
                        </span>
                      </div>
                    </div>

                    <p className='text-muted-foreground text-center'>
                      Try one of the examples below or tell me what you'd like
                      to plan!
                    </p>
                  </div>
                </motion.div>

                {/* Suggested Actions */}
                <div className='space-y-2'>
                  {suggestedActions.map((suggestedAction, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      key={index}
                    >
                      <button
                        onClick={() => {
                          if (!currentChatId) {
                            const newChat = createNewChat();
                            setCurrentChatId(newChat.id);
                          }
                          append({
                            role: 'user',
                            content: suggestedAction.action,
                          });
                        }}
                        className='w-full text-left border border-border text-foreground rounded-xl p-4 text-sm hover:bg-accent hover:border-border/60 transition-colors flex flex-col gap-1'
                      >
                        <span className='font-medium text-foreground'>
                          {suggestedAction.title}
                        </span>
                        <span className='text-muted-foreground'>
                          {suggestedAction.label}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  toolInvocations={message.toolInvocations}
                  reasoningMessages={[]}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className='absolute bottom-6 left-0 right-0 px-4'>
          <div className='max-w-3xl mx-auto'>
            <form
              onSubmit={handleSubmitWithChat}
              className='relative bg-card rounded-xl border border-border shadow-lg'
            >
              <input
                ref={inputRef}
                className='w-full bg-transparent rounded-xl px-4 py-3 outline-none text-foreground focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground'
                placeholder='What would you like to plan today?'
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
