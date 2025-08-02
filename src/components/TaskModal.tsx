import type { Task } from "../Type";

interface TaskModalProps {
  isOpen: boolean;
  taskData: Task | null;
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
          <strong>Status:</strong> {taskData.status}
        </div>

        <div className="modal-field">
          <strong>Message:</strong> {taskData.message}
        </div>

        <div className="modal-field">
          <strong>Task ID:</strong> {taskData.data.taskId}
        </div>

        <div className="modal-field">
          <strong>Title:</strong> {taskData.data.title}
        </div>

        <div className="modal-field">
          <strong>Description:</strong> {taskData.data.description}
        </div>

        <div className="modal-field">
          <strong>Status:</strong>{" "}
          {taskData.data.status ? "Completed" : "Pending"}
        </div>

        <div className="modal-field">
          <strong>Created At:</strong>{" "}
          {new Date(taskData.data.createdAt).toLocaleString()}
        </div>

        <div className="modal-field">
          <strong>Updated At:</strong>{" "}
          {new Date(taskData.data.updateAt).toLocaleString()}
        </div>
      </article>
    </div>
  );
}
