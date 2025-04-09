'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNewChat, getChats } from '@/lib/chat';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const initializeChat = async () => {
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
    };

    initializeChat();
  }, [router]);

  return null;
}
