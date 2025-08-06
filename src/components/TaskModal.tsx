import type { Event } from "types/EventType";

interface TaskModalProps {
  isOpen: boolean;
  taskData: Event | null;
  onClose: () => void;
}

export function TaskModal({ isOpen, taskData, onClose }: TaskModalProps) {
  if (!isOpen || !taskData) {
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
          <strong>Status:</strong> {taskData.complete}
        </div>

        <div className="modal-field">
          <strong>Message:</strong> {taskData.description}
        </div>

        <div className="modal-field">
          <strong>Event ID:</strong> {taskData.eventId}
        </div>

        <div className="modal-field">
          <strong>Event Title:</strong> {taskData.title}
        </div>

        <div className="modal-field">
          <strong>Event Description:</strong> {taskData.description}
        </div>

        <div className="modal-field">
          <strong>Status:</strong>{" "}
          {taskData.complete ? "Completed" : "Pending"}
        </div>

        <div className="modal-field">
          <strong>Created At:</strong>{" "}
          {new Date(taskData.createdAt || "").toLocaleString()}
        </div>

        <div className="modal-field">
          <strong>Updated At:</strong>{" "}
          {new Date(taskData.updateAt || "").toLocaleString()}
        </div>
      </article>
    </div>
  );
}
