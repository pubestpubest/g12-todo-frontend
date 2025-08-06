import "@styles/EventList.css";
import type { Event } from "types/EventType";
import EventAccordian from "@components/EventAccordian";

interface EventListProps {
  events: Event[] | null;
  onToggleComplete?: (eventId: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onToggleComplete }) => {
  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : [];
  
  return (
    <div className="event-list">
      {safeEvents.map((event) => (
        <EventAccordian 
          key={event.eventId} 
          event={event} 
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default EventList;
