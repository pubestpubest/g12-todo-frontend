export interface Event {
  id: number;
  title: string;
  description?: string; // optional
  complete: boolean;
  createdAt?: string; // ISO string from backend (nullable)
  updatedAt?: string; // same
  location: string;
  startTime: string; // assume ISO format
  endTime: string;
}
