import { useState } from "react";
import type { Event } from "types/EventType";
import "@styles/EventAccordion.css";

interface EventAccordionProps {
  event: Event;
  onToggleComplete?: (eventId: number) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: number) => void;
}

const EventAccordion: React.FC<EventAccordionProps> = ({ 
  event, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // แปลงเวลาหากต้องการให้ดูดี (เช่น วัน/เวลา)
  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleComplete = () => {
    onToggleComplete?.(event.eventId);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle when clicking checkbox
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle when clicking edit
    onEdit?.(event);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle when clicking delete
    onDelete?.(event.eventId);
  };

  return (
    <div
      className={`event-accordion ${event.complete ? "completed" : "pending"} ${isExpanded ? "expanded" : "collapsed"}`}
    >
      {/* Always visible header */}
      <div className="event-accordion-header" onClick={handleToggleExpand} data-test={`event-accordion-${event.eventId}`}>
        <div className="event-accordion-main">
          <div className="event-title-section">
            <input
              type="checkbox"
              checked={event.complete}
              onChange={handleToggleComplete}
              onClick={handleCheckboxClick}
              className="complete-checkbox"
            />
            <h2 className={`event-title ${event.complete ? "completed" : ""}`}>
              {event.title}
            </h2>
          </div>
          
          <div className="event-dates">
            <p className="event-startdate">📆 {formatDate(event.startTime)}</p>
            <p className="event-date-divider">to</p>
            <p className="event-enddate">📆 {formatDate(event.endTime)}</p>
          </div>
        </div>

        <div className="event-actions">
          <button className="edit-button" onClick={handleEdit}>✏️</button>
          <button className="delete-button" onClick={handleDelete}>🗑️</button>
          <button className="expand-button">
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="event-accordion-expanded">
          <hr className="event-divider" />
          {event.description && (
            <div className="event-description-section">
              <h4 data-test="event-description-title">Description:</h4>
              <p className="event-description">{event.description}</p>
            </div>
          )}
          <p className="event-location">📍 {event.location}</p>
          <div className="event-meta-section">
            <p className="event-meta">Created: {formatDate(event.createdAt!)}</p>
            <p className="event-meta">Updated: {formatDate(event.updateAt!)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAccordion;
