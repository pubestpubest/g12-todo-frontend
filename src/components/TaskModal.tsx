import type { Event } from "types/EventType";

interface EventModalProps {
  isOpen: boolean;
  eventData: Event | null;
  onClose: () => void;
}

export function EventModal({ isOpen, eventData, onClose }: EventModalProps) {
  if (!isOpen || !eventData) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <article className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Task Details</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal-field">
          <strong>Status:</strong> {eventData.complete}
        </div>

        <div className="modal-field">
          <strong>Message:</strong> {eventData.description}
        </div>

        <div className="modal-field">
          <strong>Event ID:</strong> {eventData.eventId}
        </div>

        <div className="modal-field">
          <strong>Event Title:</strong> {eventData.title}
        </div>

        <div className="modal-field">
          <strong>Event Description:</strong> {eventData.description}
        </div>

        <div className="modal-field">
          <strong>Status:</strong>{" "}
          {eventData.complete ? "Completed" : "Pending"}
        </div>

        <div className="modal-field">
          <strong>Created At:</strong>{" "}
          {new Date(eventData.createdAt || "").toLocaleString()}
        </div>

        <div className="modal-field">
          <strong>Updated At:</strong>{" "}
          {new Date(eventData.updateAt || "").toLocaleString()}
        </div>
      </article>
    </div>
  );
}
