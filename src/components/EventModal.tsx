import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@styles/EventModal.css";
import type { Event } from "types/EventType";

interface EventModalProps {
  isOpen: boolean;
  eventData: Event | null;
  onClose: () => void;
  onSave: (updatedEvent: Omit<Event, 'eventId' | 'createdAt' | 'updateAt'>) => void;
}

export function EventModal({ isOpen, eventData, onClose, onSave }: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [complete, setComplete] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    setHours(setMinutes(new Date(), 0), 9) // Default to 9:00 AM
  );
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (eventData) {
        // Edit mode: populate with existing event data
        setTitle(eventData.title);
        setDescription(eventData.description || "");
        setLocation(eventData.location);
        setComplete(eventData.complete);
        setStartDate(new Date(eventData.startTime));
        setEndDate(new Date(eventData.endTime));
      } else {
        // Create mode: reset to default values
        setTitle("");
        setDescription("");
        setLocation("");
        setComplete(false);
        setStartDate(setHours(setMinutes(new Date(), 0), 9)); // Default to 9:00 AM
        setEndDate(setHours(setMinutes(new Date(), 0), 10)); // Default to 10:00 AM
      }
    }
  }, [isOpen, eventData]);

  if (!isOpen) {
    return null;
  }

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    console.log('Start date - Display format:', date?.toLocaleString('en-US'));
    console.log('Start date - API format:', date?.toISOString());
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    console.log('End date - Display format:', date?.toLocaleString('en-US'));
    console.log('End date - API format:', date?.toISOString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !location.trim() || !startDate || !endDate) {
      alert("Please fill in all required fields and select valid dates");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      complete,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <article className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{eventData ? 'Edit Event' : 'Create New Event'}</h2>
        </header>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title *</label>
            <input
              className="form-input"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              className="form-textarea"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">Location *</label>
            <input
              className="form-input"
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Enter event location"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                className="form-checkbox"
                type="checkbox"
                checked={complete}
                onChange={(e) => setComplete(e.target.checked)}
              />
              Mark as completed
            </label>
          </div>

          <div className="date-picker-row">
            <div className="date-picker-group">
              <label className="form-label">Start Date & Time *</label>
              <div className="date-picker-container">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  dateFormat="M/d/yyyy, h:mm:ss aa"
                  placeholderText="Select start date and time"
                  className="date-picker"
                />
              </div>
            </div>

            <div className="date-picker-group">
              <label className="form-label">End Date & Time *</label>
              <div className="date-picker-container">
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || undefined}
                  showTimeSelect
                  timeFormat="HH:mm:ss"
                  dateFormat="M/d/yyyy, h:mm:ss aa"
                  placeholderText="Select end date and time"
                  className="date-picker"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
