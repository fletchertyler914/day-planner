'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createNewChat, getChats } from '@/lib/chat';

export default function RootPage() {
  const router = useRouter();
  const initializingRef = useRef(false);

  useEffect(() => {
    const initializeChat = async () => {
      // Prevent multiple initializations
      if (initializingRef.current) {
        return;
      }
      initializingRef.current = true;

      try {
        const chats = await getChats();
        let chatId;

        if (chats.length > 0) {
          // Use the most recent chat
          chatId = chats[0].id;
        } else {
          // Only create a new chat if there are none
          const newChat = await createNewChat();
          chatId = newChat.id;
        }

        router.push(`/chat/${chatId}`);
      } catch (error) {
        console.error('Error initializing chat:', error);
        initializingRef.current = false;
      }
    };

    initializeChat();
  }, [router]);

  return (
    <div className='flex h-dvh items-center justify-center bg-background'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
    </div>
  );
}
