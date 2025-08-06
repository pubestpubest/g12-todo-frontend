import { useState } from "react";
import type { Event } from "../Type";
import "./EditModal.css";

interface EditModalProps {
  event: Event;
  onClose: () => void;
  onSave: (updated: Event) => void;
}

const EditModal: React.FC<EditModalProps> = ({ event, onClose, onSave }) => {
  const [form, setForm] = useState({ ...event });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Event</h3>
          <button className="modal-close-button" onClick={onClose}>
            ❌
          </button>
        </div>

        <div className="modal-field">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>

        <div className="modal-field">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="modal-field">
          <label>Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </div>

        <div className="modal-field">
          <label>Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime.slice(0, 16)}
            onChange={handleChange}
          />
        </div>

        <div className="modal-field">
          <label>End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime.slice(0, 16)}
            onChange={handleChange}
          />
        </div>

        <div className="modal-field">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
