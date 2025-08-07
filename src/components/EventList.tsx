import "@styles/EventList.css";
import type { Event } from "types/EventType";
import EventAccordion from "@components/EventAccordion";

interface EventListProps {
  events: Event[] | null;
  onToggleComplete?: (eventId: number) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onToggleComplete, onEdit, onDelete }) => {
  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : [];
  
  // Sort events: incomplete first, then complete, then by start date within each group
  const sortedEvents = [...safeEvents].sort((a, b) => {
    // First sort by completion status (incomplete first)
    if (a.complete !== b.complete) {
      return a.complete ? 1 : -1; // incomplete (false) comes before complete (true)
    }
    
    // Then sort by start date
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);
    return dateA.getTime() - dateB.getTime(); // earliest first
  });
  
  return (
    <div className="event-list">
      {sortedEvents.map((event) => (
        <EventAccordion 
          key={event.eventId} 
          event={event} 
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EventList;
