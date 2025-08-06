import { useEffect, useState } from "react";
import NavBar from "@components/NavBar";
import DashboardHeader from "@components/DashboardHeader";
import EventList from "@components/EventList";
import type { Event } from "types/EventType";
import type { ApiResponse } from "types/ResponseType";
import "@styles/App.css";
import { useAxios } from "@hooks/useAxios";

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);

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

  const total = events.length;
  const completed = events.filter((e: Event) => e.complete).length;
  const pending = total - completed;

  return (
    <>
      <NavBar />
      <div className="app-container" >
        <DashboardHeader total={total} completed={completed} pending={pending} />
        {loading ? <p>Loading...</p> : <EventList events={events} onToggleComplete={handleToggleComplete} />}
      </div>
    </>
  );
};

export default App;
