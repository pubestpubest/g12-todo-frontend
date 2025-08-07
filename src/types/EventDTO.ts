/**
 * Data Transfer Objects for Event API communication
 * These DTOs represent the exact structure expected by the API
 */

// DTO for creating a new event (POST request)
export interface CreateEventDTO {
  title: string;
  description?: string;
  location: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  complete: boolean;
}

// DTO for updating an existing event (PUT request)
export interface UpdateEventDTO {
  title: string;
  description?: string;
  location: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  complete: boolean;
}

// DTO for event data received from API (GET response)
export interface EventResponseDTO {
  eventId: number;
  title: string;
  description?: string;
  complete: boolean;
  createdAt?: string; // ISO string from backend (nullable)
  updateAt?: string; // API uses 'updateAt' instead of 'updatedAt'
  location: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

// DTO for partial event updates (PATCH request, if needed)
export interface PartialEventDTO {
  title?: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  complete?: boolean;
}
