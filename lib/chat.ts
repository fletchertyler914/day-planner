import { Message } from 'ai';
import { openDB, IDBPDatabase } from 'idb';

export interface Chat {
  id: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

const DB_NAME = 'day-planner-db';
const STORE_NAME = 'chats';
const DB_VERSION = 1;

// Initialize the database
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the chats store with an index on updated_at
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('updated_at', 'updated_at');
    },
  });
}

// Get a database connection
let dbPromise: Promise<IDBPDatabase> | null = null;
async function getDB() {
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
}

export async function getChats(): Promise<Chat[]> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const chats = await store.getAll();

    // Sort by updated_at, newest first
    return chats.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
}

export async function saveChat(
  chat: Partial<Chat> & { id: string; messages: Message[] }
) {
  try {
    const db = await getDB();
    const now = new Date().toISOString();

    // Get existing chat to preserve created_at if it exists
    const existingChat = await db.get(STORE_NAME, chat.id);

    const updatedChat: Chat = {
      id: chat.id,
      messages: chat.messages,
      created_at: existingChat?.created_at || now,
      updated_at: now,
    };

    await db.put(STORE_NAME, updatedChat);
  } catch (error) {
    console.error('Error saving chat:', error);
  }
}

export async function deleteChat(chatId: string) {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, chatId);
  } catch (error) {
    console.error('Error deleting chat:', error);
  }
}

export async function deleteAllChats() {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
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
