import { useState } from "react";
import type { Event } from "../Type";
import EditModal from "./EditModal";
import "./EventCard.css";

interface EventCardProps {
  event: Event;
  onUpdate: (updated: Event) => void;
  onDelete: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const borderColor = event.complete ? "green" : "blue";
  const textClass = event.complete ? "event-title completed" : "event-title";

  // แปลงเวลาหากต้องการให้ดูดี (เช่น วัน/เวลา)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  function onDelete(id: number) {
    throw new Error("Function not implemented.");
  }

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
          <button className="edit-button" onClick={() => setShowEdit(true)}>
            ✏️
          </button>
          <button
            className="delete-button"
            onClick={() => setShowConfirm(true)}
          >
            🗑️
          </button>
        </div>
      </div>
      <hr className="event-divider" />
      <p className="event-meta">Created: {formatDate(event.createdAt!)}</p>
      <p className="event-meta">Updated: {formatDate(event.updatedAt!)}</p>
      {showEdit && (
        <EditModal
          event={event}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => {
            onUpdate(updated);
            setShowEdit(false);
          }}
        />
      )}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">
              Are you sure you want to delete this event?
            </p>
            <div className="modal-buttons">
              <button
                className="btn btn-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-delete"
                onClick={() => {
                  onDelete(event.id);
                  setShowConfirm(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
