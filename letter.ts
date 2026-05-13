export interface Letter {
  id: string;
  recipient: string;
  content: string;
  unlockAt: string; // ISO 8601
  createdAt: string; // ISO 8601
}
