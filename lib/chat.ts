import { Message } from 'ai';
import { createClient } from '@/lib/supabase/client';

export interface Chat {
  id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

const supabase = createClient();

export async function getChats(): Promise<Chat[]> {
  const { data: chats, error } = await supabase
    .from('chats')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    return [];
  }

  return chats || [];
}

export async function saveChat(
  chat: Partial<Chat> & { id: string; messages: Message[] }
) {
  const { error } = await supabase.from('chats').upsert({
    id: chat.id,
    messages: chat.messages,
  });

  if (error) {
    console.error('Error saving chat:', error);
  }
}

export async function deleteChat(chatId: string) {
  const { error } = await supabase.from('chats').delete().eq('id', chatId);

  if (error) {
    console.error('Error deleting chat:', error);
  }
}

// We'll keep current chat ID in localStorage since it's just UI state
const CURRENT_CHAT_ID_KEY = 'day-planner-current-chat-id';

export function getCurrentChatId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_CHAT_ID_KEY);
}

export function setCurrentChatId(chatId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_CHAT_ID_KEY, chatId);
}

export async function createNewChat(): Promise<Chat> {
  const chat: Partial<Chat> = {
    messages: [],
  };

  const { data, error } = await supabase
    .from('chats')
    .insert(chat)
    .select()
    .single();

  if (error) {
    console.error('Error creating chat:', error);
    throw error;
  }

  setCurrentChatId(data.id);
  return data;
}
