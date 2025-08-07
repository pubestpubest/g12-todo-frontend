/**
 * Utility functions to convert between Event domain objects and EventDTO API objects
 */

import type { Event } from '../types/EventType';
import type { 
  CreateEventDTO, 
  UpdateEventDTO, 
  EventResponseDTO,
  PartialEventDTO 
} from '../types/EventDTO';

/**
 * Convert Event to CreateEventDTO for POST requests
 */
export const eventToCreateDTO = (event: Omit<Event, 'eventId' | 'createdAt' | 'updateAt'>): CreateEventDTO => {
  return {
    title: event.title,
    description: event.description || '',
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    complete: event.complete
  };
};

/**
 * Convert Event to UpdateEventDTO for PUT requests
 */
export const eventToUpdateDTO = (event: Omit<Event, 'eventId' | 'createdAt' | 'updateAt'>): UpdateEventDTO => {
  return {
    title: event.title,
    description: event.description || '',
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    complete: event.complete
  };
};

/**
 * Convert partial Event data to PartialEventDTO for PATCH requests
 */
export const eventToPartialDTO = (eventData: Partial<Event>): PartialEventDTO => {
  const dto: PartialEventDTO = {};
  
  if (eventData.title !== undefined) dto.title = eventData.title;
  if (eventData.description !== undefined) dto.description = eventData.description;
  if (eventData.complete !== undefined) {
    dto.complete = eventData.complete;
  }
  if (eventData.location !== undefined) dto.location = eventData.location;
  if (eventData.startTime !== undefined) dto.startTime = eventData.startTime;
  if (eventData.endTime !== undefined) dto.endTime = eventData.endTime;
  
  return dto;
};

/**
 * Convert EventResponseDTO from API to Event domain object
 */
export const eventResponseDTOToEvent = (dto: EventResponseDTO): Event => {
  return {
    eventId: dto.eventId,
    title: dto.title,
    description: dto.description,
    complete: dto.complete,
    createdAt: dto.createdAt,
    updateAt: dto.updateAt,
    location: dto.location,
    startTime: dto.startTime,
    endTime: dto.endTime
  };
};

/**
 * Convert array of EventResponseDTO to array of Event objects
 */
export const eventResponseDTOArrayToEventArray = (dtos: EventResponseDTO[]): Event[] => {
  return dtos.map(eventResponseDTOToEvent);
};

/**
 * Generate a robust temporary ID for optimistic UI updates
 * Uses negative numbers to distinguish from real API IDs
 */
let tempIdCounter = 0;

export const generateTempEventId = (): number => {
  tempIdCounter = (tempIdCounter + 1) % 1000;
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  
  // Create negative ID: -[timestamp][3-digit-random][3-digit-counter]
  return -(timestamp * 1000000 + random * 1000 + tempIdCounter);
};

/**
 * Check if an event ID is a temporary ID (negative number)
 */
export const isTempEventId = (eventId: number): boolean => {
  return eventId < 0;
};
