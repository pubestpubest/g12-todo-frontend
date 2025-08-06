import "./EventList.css";
import type { Event } from "../Type";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
  onUpdate: (updated: Event) => void;
  onDelete: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EventList;
