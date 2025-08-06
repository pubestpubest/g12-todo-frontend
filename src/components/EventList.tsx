import "@styles/EventList.css";
import type { Event } from "types/EventType";
import EventCard from "@components/EventCard";

interface EventListProps {
  events: Event[] | null;
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  // Ensure events is always an array
  const safeEvents = Array.isArray(events) ? events : [];
  
  return (
    <div className="event-list">
      {safeEvents.map((event) => (
        <EventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
};

export default EventList;
