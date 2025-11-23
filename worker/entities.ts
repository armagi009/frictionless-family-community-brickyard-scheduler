import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Session, Family, Booking, LegoSet } from "@shared/types";
import { MOCK_SESSIONS, MOCK_FAMILIES, MOCK_BOOKINGS, MOCK_SETS } from "@shared/mock-data";
// Brickyard Entities
export class SessionEntity extends IndexedEntity<Session> {
  static readonly entityName = "session";
  static readonly indexName = "sessions";
  static readonly initialState: Session = { 
    id: "", title: "", startTs: 0, endTs: 0, ageMin: 0, ageMax: 99, 
    tags: [], type: 'free-play', location: "", capacity: 0, notes: "" 
  };
  static seedData = MOCK_SESSIONS;
}
export class FamilyEntity extends IndexedEntity<Family> {
  static readonly entityName = "family";
  static readonly indexName = "families";
  static readonly initialState: Family = { 
    id: "", name: "", parentName: "", parentEmail: "", children: [] 
  };
  static seedData = MOCK_FAMILIES;
}
export class BookingEntity extends IndexedEntity<Booking> {
  static readonly entityName = "booking";
  static readonly indexName = "bookings";
  static readonly initialState: Booking = { 
    id: "", sessionId: "", familyId: "", childId: "", status: 'pending', 
    approvalToken: "", createdTs: 0 
  };
  static seedData = MOCK_BOOKINGS;
}
export class LegoSetEntity extends IndexedEntity<LegoSet> {
    static readonly entityName = "legoset";
    static readonly indexName = "legosets";
    static readonly initialState: LegoSet = {
        id: "", title: "", shelf: 'Ready for Play', pieceCount: 0, instructionsUrl: ""
    };
    static seedData = MOCK_SETS;
}
// Original Demo Entities
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}