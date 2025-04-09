import { Message } from 'ai';

const CHAT_STORAGE_KEY = 'day-planner-chats';
const CURRENT_CHAT_ID_KEY = 'day-planner-current-chat-id';

export interface Chat {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export function getChats(): Chat[] {
  if (typeof window === 'undefined') return [];
  const chats = localStorage.getItem(CHAT_STORAGE_KEY);
  return chats ? JSON.parse(chats) : [];
}

export function saveChat(chat: Chat) {
  if (typeof window === 'undefined') return;
  const chats = getChats();
  const existingIndex = chats.findIndex((c) => c.id === chat.id);

  if (existingIndex >= 0) {
    chats[existingIndex] = chat;
  } else {
    chats.push(chat);
  }

  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}

export function deleteChat(chatId: string) {
  if (typeof window === 'undefined') return;
  const chats = getChats().filter((chat) => chat.id !== chatId);
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}

export function getCurrentChatId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_CHAT_ID_KEY);
}

export function setCurrentChatId(chatId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_CHAT_ID_KEY, chatId);
}

export function createNewChat(): Chat {
  const chat: Chat = {
    id: crypto.randomUUID(),
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveChat(chat);
  setCurrentChatId(chat.id);
  return chat;
}
