import { useEffect, useState } from "react";
import NavBar from "@components/NavBar";
import DashboardHeader from "@components/DashboardHeader";
import EventList from "@components/EventList";
import { EventModal } from "@components/EventModal";
import type { Event } from "types/EventType";
import type { ApiResponse } from "types/ResponseType";
import type { EventResponseDTO, CreateEventDTO, UpdateEventDTO } from "types/EventDTO";
import "@styles/App.css";
import { useAxios } from "@hooks/useAxios";
import { 
  eventToCreateDTO, 
  eventToUpdateDTO, 
  eventResponseDTOToEvent,
  eventResponseDTOArrayToEventArray,
  generateTempEventId 
} from "@utils/eventMapper";

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const { data: apiResponse, loading, sendRequest } = useAxios<ApiResponse<EventResponseDTO[]>>({
    url: "/api/v1/events?limit=100",
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
      const eventDTOs = Array.isArray(apiResponse.data) ? apiResponse.data : [];
      const events = eventResponseDTOArrayToEventArray(eventDTOs);
      setEvents(events);
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

    // Prepare PUT request payload using DTO
    const payload: UpdateEventDTO = eventToUpdateDTO({
      ...eventToUpdate,
      complete: !eventToUpdate.complete // Toggle the completion status
    });

    // Send PUT request to update the entire event
    const response = await updateEvent({
      url: `/api/v1/events/${eventId}`,
      data: payload
    });
    
    // Handle response
    if (response) {
      try {
        // Parse API response - response is AxiosResponse, so we need .data
        const apiResponse = (response as any).data as ApiResponse<EventResponseDTO>;
        
        if (apiResponse.status === 'SUCCESS' && apiResponse.data) {
          // Success: update local state with real event data from API
          const updatedEventFromAPI = eventResponseDTOToEvent(apiResponse.data);
          
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.eventId === eventId ? updatedEventFromAPI : event
            )
          );
        } else {
          // API returned non-success status - revert state
          console.warn('API returned non-success status for toggle:', apiResponse.status);
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.eventId === eventId 
                ? eventToUpdate // Revert to original state
                : event
            )
          );
        }
      } catch (error) {
        // Error parsing response - revert state
        console.error('Error parsing toggle response:', error);
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.eventId === eventId 
              ? eventToUpdate // Revert to original state
              : event
          )
        );
      }
    } else if (updateError) {
      // Network/request error - revert local state
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

    // Prepare PUT request payload using DTO
    const payload: UpdateEventDTO = eventToUpdateDTO(updatedEventData);

    // Send PUT request to update the entire event
    const response = await updateEvent({
      url: `/api/v1/events/${selectedEvent.eventId}`,
      data: payload
    });
    
    // Handle response
    if (response) {
      try {
        // Parse API response - response is AxiosResponse, so we need .data
        const apiResponse = (response as any).data as ApiResponse<EventResponseDTO>;
        
        if (apiResponse.status === 'SUCCESS' && apiResponse.data) {
          // Success: update local state with real event data from API
          const updatedEventFromAPI = eventResponseDTOToEvent(apiResponse.data);
          
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.eventId === selectedEvent.eventId ? updatedEventFromAPI : event
            )
          );
          
          handleCloseEditModal();
          showToast(apiResponse.message || 'Event updated successfully!', 'success');
        } else {
          // API returned non-success status
          console.warn('API returned non-success status:', apiResponse.status);
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.eventId === selectedEvent.eventId 
                ? selectedEvent // Revert to original state
                : event
            )
          );
          showToast(apiResponse.message || 'Failed to update event.', 'error');
        }
      } catch (error) {
        // Error parsing response - revert state
        console.error('Error parsing update response:', error);
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.eventId === selectedEvent.eventId 
              ? selectedEvent // Revert to original state
              : event
          )
        );
        showToast('Failed to update event. Please try again.', 'error');
      }
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
    // Generate robust temporary ID for optimistic UI update
    const tempId = generateTempEventId();
    
    // Create temporary event for immediate UI feedback
    const tempEvent: Event = {
      eventId: tempId,
      ...newEventData,
      createdAt: new Date().toISOString(),
      updateAt: new Date().toISOString()
    };
    
    // Add to UI immediately for responsive experience
    setEvents(prevEvents => [...prevEvents, tempEvent]);
    handleCloseCreateModal();
    showToast('Creating event...', 'success');

    // Prepare POST request payload using DTO
    const payload: CreateEventDTO = eventToCreateDTO(newEventData);

    // Send POST request to create new event
    const response = await createEvent({
      url: `/api/v1/events`,
      data: payload
    });
    
    // Handle response
    if (response) {
      try {
        // Parse API response - response is AxiosResponse, so we need .data
        const apiResponse = (response as any).data as ApiResponse<EventResponseDTO>;
        
        if (apiResponse.status === 'SUCCESS' && apiResponse.data) {
          // Success: replace temp event with real event from API
          const realEvent = eventResponseDTOToEvent(apiResponse.data);
          
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.eventId === tempId ? realEvent : event
            )
          );
          showToast(apiResponse.message || 'Event created successfully!', 'success');
        } else {
          // API returned non-success status - remove temp event
          console.warn('API returned non-success status:', apiResponse.status);
          setEvents(prevEvents => prevEvents.filter(event => event.eventId !== tempId));
          showToast(apiResponse.message || 'Failed to create event.', 'error');
        }
      } catch (error) {
        // Error parsing response - remove temp event
        console.error('Error parsing create event response:', error);
        setEvents(prevEvents => prevEvents.filter(event => event.eventId !== tempId));
        showToast('Failed to create event. Please try again.', 'error');
      }
    } else if (createError) {
      // Error: remove temp event and show error
      console.error('Failed to create event:', createError);
      setEvents(prevEvents => prevEvents.filter(event => event.eventId !== tempId));
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
          <button className="create-event-button" data-test="create-event-button" onClick={handleCreateEvent}>
            ➕ Create New Event
          </button>
        </div>
        
        {loading ? <p data-test="loading-text">Loading...</p> : <EventList events={events} onToggleComplete={handleToggleComplete} onEdit={handleEditEvent} onDelete={handleDeleteEvent} />}
      </div>
      <EventModal 
        isOpen={isEditModalOpen}
        eventData={selectedEvent}
        onClose={handleCloseEditModal}
        onSave={handleSaveEvent}
        showToast={showToast}
      />
      
      {/* Create Event Modal */}
      <EventModal 
        isOpen={isCreateModalOpen}
        eventData={null}
        onClose={handleCloseCreateModal}
        onSave={handleSaveNewEvent}
        showToast={showToast}
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
        <div className={`toast toast-${toastType}`} data-test="toast">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default App;
