import { useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import EventList from "./components/EventList";
import type { Event } from "./Type"; // หรือประกาศในไฟล์เดียว
import "./App.css";

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/v1/tasks");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      console.log(data.data);
      setEvents(data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${updatedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) throw new Error("Failed to update event");

      const result = await response.json();
      setEvents((prev) => prev.map((e) => (e.id === result.id ? result : e)));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const total = events.length;
  const completed = events.filter((e) => e.complete).length;
  const pending = total - completed;

  return (
    <div className="app-container">
      <DashboardHeader total={total} completed={completed} pending={pending} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <EventList
          events={events}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default App;
