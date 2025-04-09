import Dexie, { type Table } from 'dexie';
import { Message } from 'ai';

export interface Chat {
  id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  openai_api_key: string;
}

export class DayPlannerDB extends Dexie {
  chats!: Table<Chat>;
  settings!: Table<Settings>;

  constructor() {
    super('day-planner-db');
    this.version(1).stores({
      chats: 'id, updated_at',
      settings: 'id',
    });
  }
}

export const db = new DayPlannerDB();

// Initialize settings if they don't exist
export async function initializeSettings() {
  const settings = await db.settings.get('default');
  if (!settings) {
    await db.settings.put({
      id: 'default',
      openai_api_key: '',
    });
  }
}

// Settings helpers
export async function getOpenAIKey(): Promise<string> {
  const settings = await db.settings.get('default');
  return settings?.openai_api_key || '';
}

export async function setOpenAIKey(key: string): Promise<void> {
  await db.settings.put({
    id: 'default',
    openai_api_key: key,
  });
}

// Chat helpers
export async function getChats(): Promise<Chat[]> {
  try {
    return await db.chats.orderBy('updated_at').reverse().toArray();
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
}

export async function saveChat(
  chat: Partial<Chat> & { id: string; messages: Message[] }
) {
  try {
    const now = new Date().toISOString();
    const existingChat = await db.chats.get(chat.id);

    const updatedChat: Chat = {
      id: chat.id,
      messages: chat.messages,
      created_at: existingChat?.created_at || now,
      updated_at: now,
    };

    await db.chats.put(updatedChat);
  } catch (error) {
    console.error('Error saving chat:', error);
  }
}

export async function deleteChat(chatId: string) {
  try {
    await db.chats.delete(chatId);
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
}

export async function deleteAllChats() {
  try {
    await db.chats.clear();
  } catch (error) {
    console.error('Error clearing chats:', error);
  }
}

export async function createNewChat(): Promise<Chat> {
  const chat: Chat = {
    id: crypto.randomUUID(),
    messages: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await saveChat(chat);
    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}
