import { useEffect, useState } from "react";
import NavBar from "@components/NavBar";
import DashboardHeader from "@components/DashboardHeader";
import EventList from "@components/EventList";
import { EventModal } from "@components/EventModal";
import type { Event } from "types/EventType";
import type { ApiResponse } from "types/ResponseType";
import "@styles/App.css";
import { useAxios } from "@hooks/useAxios";

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const { data: apiResponse, loading, sendRequest } = useAxios<ApiResponse<Event[]>>({
    url: "/api/v1/events",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    sendRequest();
  }, []);

  // Update local events state when API response changes
  useEffect(() => {
    if (apiResponse?.data) {
      setEvents(Array.isArray(apiResponse.data) ? apiResponse.data : []);
    }
  }, [apiResponse]);

  // useAxios hook for PUT request
  const { sendRequest: updateEvent, error: updateError } = useAxios({
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // useAxios hook for DELETE request
  const { sendRequest: deleteEvent, error: deleteError } = useAxios({
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // useAxios hook for POST request (create)
  const { sendRequest: createEvent, error: createError } = useAxios({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleToggleComplete = async (eventId: number) => {
    // Find the event to update
    const eventToUpdate = events.find(event => event.eventId === eventId);
    if (!eventToUpdate) return;

    // Update local state immediately for responsive UI
    const updatedEvent = { ...eventToUpdate, complete: !eventToUpdate.complete };
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.eventId === eventId ? updatedEvent : event
      )
    );

    // Prepare PUT request payload
    const payload = {
      title: eventToUpdate.title,
      description: eventToUpdate.description || "",
      status: !eventToUpdate.complete, // Toggle the current status
      location: eventToUpdate.location,
      startTime: eventToUpdate.startTime,
      endTime: eventToUpdate.endTime,
      complete: !eventToUpdate.complete // Toggle the current completion
    };

    // Send PUT request to update the entire event
    const response = await updateEvent({
      url: `/api/v1/events/${eventId}`,
      data: payload
    });
    
    console.log(`PUT /api/v1/events/${eventId}`, payload);
    
    // If the request failed (no response), revert local state
    if (!response && updateError) {
      console.error('Failed to update event completion:', updateError);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.eventId === eventId 
            ? eventToUpdate // Revert to original state
            : event
        )
      );
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveEvent = async (updatedEventData: Omit<Event, 'eventId' | 'createdAt' | 'updateAt'>) => {
    if (!selectedEvent) return;

    // Update local state immediately for responsive UI
    const updatedEvent = { 
      ...selectedEvent, 
      ...updatedEventData,
      // Keep the original timestamps
      createdAt: selectedEvent.createdAt,
      updateAt: new Date().toISOString() // Update the updateAt timestamp
    };
    
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.eventId === selectedEvent.eventId ? updatedEvent : event
      )
    );

    // Prepare PUT request payload
    const payload = {
      title: updatedEventData.title,
      description: updatedEventData.description || "",
      status: updatedEventData.complete,
      location: updatedEventData.location,
      startTime: updatedEventData.startTime,
      endTime: updatedEventData.endTime,
      complete: updatedEventData.complete
    };

    // Send PUT request to update the entire event
    const response = await updateEvent({
      url: `/api/v1/events/${selectedEvent.eventId}`,
      data: payload
    });
    
    console.log(`PUT /api/v1/events/${selectedEvent.eventId}`, payload);
    
    // Handle response
    if (response) {
      // Success: close modal and show success toast
      handleCloseEditModal();
      showToast('Event updated successfully!', 'success');
    } else if (updateError) {
      // Error: revert local state and show error toast
      console.error('Failed to update event:', updateError);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.eventId === selectedEvent.eventId 
            ? selectedEvent // Revert to original state
            : event
        )
      );
      showToast('Failed to update event. Please try again.', 'error');
    }
  };

  const handleSaveNewEvent = async (newEventData: Omit<Event, 'eventId' | 'createdAt' | 'updateAt'>) => {
    // Prepare POST request payload
    const payload = {
      title: newEventData.title,
      description: newEventData.description || "",
      status: newEventData.complete,
      location: newEventData.location,
      startTime: newEventData.startTime,
      endTime: newEventData.endTime,
      complete: newEventData.complete
    };

    // Send POST request to create new event
    const response = await createEvent({
      url: `/api/v1/events`,
      data: payload
    });
    
    console.log(`POST /api/v1/events`, payload);
    
    // Handle response
    if (response) {
      // Success: close modal, add to local state, and show success toast
      handleCloseCreateModal();
      
      // Create a temporary event object with mock ID for immediate UI update
      // In real app, the API response would contain the new event with proper ID
      const tempEvent: Event = {
        eventId: Date.now(), // Temporary ID, would come from API response
        ...newEventData,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString()
      };
      
      setEvents(prevEvents => [...prevEvents, tempEvent]);
      showToast('Event created successfully!', 'success');
    } else if (createError) {
      // Error: show error toast, keep modal open
      console.error('Failed to create event:', createError);
      showToast('Failed to create event. Please try again.', 'error');
    }
  };

  const handleDeleteEvent = (eventId: number) => {
    // Find the event to delete and show confirmation modal
    const event = events.find(event => event.eventId === eventId);
    if (!event) return;
    
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    // Close modal first
    handleCloseDeleteModal();

    // Remove from local state immediately for responsive UI
    setEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventToDelete.eventId));

    // Send DELETE request
    const response = await deleteEvent({
      url: `/api/v1/events/${eventToDelete.eventId}`
    });
    
    console.log(`DELETE /api/v1/events/${eventToDelete.eventId}`);
    
    // Handle response
    if (response) {
      // Success: show success toast with danger color for delete action
      showToast('Event deleted successfully!', 'error');
    } else if (deleteError) {
      // Error: restore deleted event and show error toast
      console.error('Failed to delete event:', deleteError);
      setEvents(prevEvents => [...prevEvents, eventToDelete].sort((a, b) => a.eventId - b.eventId));
      showToast('Failed to delete event. Please try again.', 'error');
    }
  };

  const total = events.length;
  const completed = events.filter((e: Event) => e.complete).length;
  const pending = total - completed;

  return (
    <>
      <NavBar />
      <div className="app-container" >
        <DashboardHeader total={total} completed={completed} pending={pending} />
        
        {/* Create Event Button */}
        <div className="create-button-container">
          <button className="create-event-button" onClick={handleCreateEvent}>
            ➕ Create New Event
          </button>
        </div>
        
        {loading ? <p>Loading...</p> : <EventList events={events} onToggleComplete={handleToggleComplete} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />}
      </div>
      <EventModal 
        isOpen={isEditModalOpen}
        eventData={selectedEvent}
        onClose={handleCloseEditModal}
        onSave={handleSaveEvent}
      />
      
      {/* Create Event Modal */}
      <EventModal 
        isOpen={isCreateModalOpen}
        eventData={null}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewEvent}
      />
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Delete Event</h2>
              <button className="modal-close-button" onClick={handleCloseDeleteModal}>
                ✕
              </button>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this event?</p>
              {eventToDelete && (
                <div className="event-preview">
                  <h3>{eventToDelete.title}</h3>
                  <p>📅 {new Date(eventToDelete.startTime).toLocaleString()}</p>
                  <p>📍 {eventToDelete.location}</p>
                </div>
              )}
              <p className="delete-warning">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button className="cancel-button" onClick={handleCloseDeleteModal}>
                Cancel
              </button>
              <button className="delete-confirm-button" onClick={handleConfirmDelete}>
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className={`toast toast-${toastType}`}>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default App;
