import { Message } from 'ai';
import {
  getChats as dbGetChats,
  saveChat as dbSaveChat,
  deleteChat as dbDeleteChat,
  deleteAllChats as dbDeleteAllChats,
  createNewChat as dbCreateNewChat,
  type Chat,
} from './db';

export type { Chat };

export async function getChats(): Promise<Chat[]> {
  return dbGetChats();
}

export async function saveChat(
  chat: Partial<Chat> & { id: string; messages: Message[] }
) {
  return dbSaveChat(chat);
}

export async function deleteChat(chatId: string) {
  return dbDeleteChat(chatId);
}

export async function deleteAllChats() {
  return dbDeleteAllChats();
}

export async function createNewChat(): Promise<Chat> {
  return dbCreateNewChat();
}
