export interface Event {
    eventId: number; // Changed from id to eventId to match API
    title: string;
    description?: string; // optional
    complete: boolean;
    createdAt?: string; // ISO string from backend (nullable)
    updateAt?: string; // Changed from updatedAt to updateAt to match API
    location: string;
    startTime: string; // assume ISO format
    endTime: string;
  }


  