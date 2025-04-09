import { useState, useCallback, useEffect } from 'react';
import { Chat } from '@/lib/chat';
import { getChats, deleteChat, saveChat } from '@/lib/chat';
import { Message } from 'ai';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial chats
  useEffect(() => {
    loadChats();
  }, []);

  // Load chats from the database
  const loadChats = useCallback(async () => {
    setIsLoading(true);
    try {
      const chatList = await getChats();
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a chat with optimistic update
  const updateChat = useCallback(
    async (chatId: string, messages: Message[]) => {
      // Optimistically update the UI
      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages, updated_at: new Date().toISOString() }
            : chat
        )
      );

      try {
        // Save to database
        await saveChat({ id: chatId, messages });
      } catch (error) {
        console.error('Error saving chat:', error);
        // Revert on error
        await loadChats();
      }
    },
    [loadChats]
  );

  // Delete a chat with optimistic update
  const removeChat = useCallback(
    async (chatId: string) => {
      // Optimistically update the UI
      setChats((currentChats) =>
        currentChats.filter((chat) => chat.id !== chatId)
      );

      try {
        // Delete from database
        await deleteChat(chatId);
      } catch (error) {
        console.error('Error deleting chat:', error);
        // Revert on error
        await loadChats();
      }
    },
    [loadChats]
  );

  // Clear all chats with optimistic update
  const clearAllChats = useCallback(async () => {
    // Store current chats in case we need to revert
    const previousChats = chats;

    // Optimistically update the UI
    setChats([]);

    try {
      // Delete all chats from database
      await Promise.all(previousChats.map((chat) => deleteChat(chat.id)));
    } catch (error) {
      console.error('Error clearing chats:', error);
      // Revert on error
      setChats(previousChats);
    }
  }, [chats]);

  return {
    chats,
    isLoading,
    updateChat,
    removeChat,
    clearAllChats,
    loadChats,
  };
}
