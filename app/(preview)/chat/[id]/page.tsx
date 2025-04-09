'use client';

import { useRef, useEffect } from 'react';
import { Message } from '@/components/message';
import { useScrollToBottom } from '@/components/use-scroll-to-bottom';
import { useChat } from 'ai/react';
import { Chat, createNewChat } from '@/lib/chat';
import { SideMenu } from '@/components/side-menu';
import { useChats } from '@/lib/hooks/use-chats';
import { useParams, useRouter } from 'next/navigation';
import { WelcomeScreen } from '@/components/welcome-screen';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const { chats, updateChat, removeChat, clearAllChats } = useChats();

  // Redirect to root if chat doesn't exist
  useEffect(() => {
    if (chats.length > 0 && !chats.find((c: Chat) => c.id === chatId)) {
      router.push('/');
    }
  }, [chatId, chats, router]);

  const {
    messages,
    handleSubmit,
    input,
    setInput,
    append,
    setMessages,
    isLoading: streamLoading,
  } = useChat({
    id: chatId,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChatSelect = (selectedChatId: string) => {
    router.push(`/chat/${selectedChatId}`);
  };

  // Load initial messages if there's a current chat
  useEffect(() => {
    const chat = chats.find((c: Chat) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
  }, [chatId, setMessages, chats]);

  // Save messages whenever they change and streaming is complete
  useEffect(() => {
    if (!chatId || messages.length === 0 || streamLoading) {
      return;
    }

    // Only save if messages have actually changed
    const currentChat = chats.find((c: Chat) => c.id === chatId);
    if (
      !currentChat ||
      JSON.stringify(currentChat.messages) !== JSON.stringify(messages)
    ) {
      // Clear any existing timeout
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }

      // Set new timeout for debounced save
      saveTimeout.current = setTimeout(() => {
        updateChat(chatId, messages);
      }, 2000);
    }

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [messages, chatId, chats, streamLoading, updateChat]);

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    router.push(`/chat/${newChat.id}`);
  };

  const handleClearAllChats = async () => {
    await clearAllChats();
    router.push('/');
  };

  const handleSuggestedActionClick = (action: string) => {
    append({
      role: 'user',
      content: action,
    });
  };

  return (
    <div className='flex h-dvh bg-background'>
      {/* Side Menu */}
      <SideMenu
        chats={chats}
        currentChatId={chatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={removeChat}
        onClearAllChats={handleClearAllChats}
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
              <WelcomeScreen
                onSuggestedActionClick={handleSuggestedActionClick}
              />
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
              onSubmit={handleSubmit}
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
