import type { Event } from "types/EventType";
import "@styles/EventCard.css";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const borderColor = event.complete ? "green" : "blue";
  const textClass = event.complete ? "event-title completed" : "event-title";

  // แปลงเวลาหากต้องการให้ดูดี (เช่น วัน/เวลา)
  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <div
      className={`event-card ${event.complete ? "completed" : "pending"}`}
      style={{ borderLeftColor: borderColor }}
    >
      <div className="event-card-content">
        <div className="event-card-text">
          <h2 className={textClass}>{event.title}</h2>
          {event.description && (
            <p className="event-description">{event.description}</p>
          )}
          <p className="event-startdate">📆 {formatDate(event.startTime)}</p>
          <p className="event-enddate">
            {"to "}
            {formatDate(event.endTime)}
          </p>
          <p className="event-location">📍 {event.location}</p>
        </div>

        <div className="event-actions">
          <button className="edit-button">✏️</button>
          <button className="delete-button">🗑️</button>
        </div>
      </div>
      <hr className="event-divider" />
      <p className="event-meta">Created: {formatDate(event.createdAt!)}</p>
      <p className="event-meta">Updated: {formatDate(event.updateAt!)}</p>
    </div>
  );
};

export default EventCard;
