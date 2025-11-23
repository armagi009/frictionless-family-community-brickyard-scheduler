export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Lego Club Types
export type SessionType = 'free-play' | 'workshop' | 'adult-night';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export interface Session {
  id: string;
  title: string;
  startTs: number;
  endTs: number;
  ageMin: number;
  ageMax: number;
  tags: string[];
  type: SessionType;
  location: string;
  capacity: number;
  notes: string;
}
export interface Child {
  id: string;
  name: string;
  age: number;
  interestTags: string[];
}
export interface Family {
  id: string;
  name: string; // e.g., "The Miller Family"
  parentName: string;
  parentEmail: string;
  children: Child[];
}
export interface Booking {
  id: string;
  sessionId: string;
  familyId: string;
  childId: string;
  status: BookingStatus;
  approvalToken: string;
  createdTs: number;
  notes?: string;
}
export interface LegoSet {
  id: string; // e.g., "10281"
  title: string; // e.g., "Bonsai Tree"
  shelf: 'Ready for Play' | 'Ready for Parts' | 'Works in Progress';
  pieceCount: number;
  instructionsUrl: string;
}
// Original Demo Types (can be removed later)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id:string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}