import { useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import EventList from "./components/EventList";
import type { Event } from "./Type"; // หรือประกาศในไฟล์เดียว
import "./App.css";

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch data (ตอนนี้ใช้ mock, อนาคตค่อยเปลี่ยนเป็น fetch API)
    const fetchEvents = async () => {
      setLoading(true);

      const mockData: Event[] = [
        {
          id: 1,
          title: "Final Presentation",
          description: "Present final project to instructor",
          complete: true,
          createdAt: "2025-08-01T09:00:00Z",
          updatedAt: "2025-08-03T13:00:00Z",
          location: "Room 402, Engineering Bldg",
          startTime: "2025-08-10T13:00:00Z",
          endTime: "2025-08-10T15:00:00Z",
        },
        {
          id: 2,
          title: "Study Group",
          complete: false,
          location: "Library",
          startTime: "2025-08-12T19:00:00Z",
          endTime: "2025-08-12T21:00:00Z",
        },
      ];

      setTimeout(() => {
        setEvents(mockData);
        setLoading(false);
      }, 500); // Mock delay
    };

    fetchEvents();
  }, []);

  const total = events.length;
  const completed = events.filter((e) => e.complete).length;
  const pending = total - completed;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <DashboardHeader total={total} completed={completed} pending={pending} />
      {loading ? <p>Loading...</p> : <EventList events={events} />}
    </div>
  );
};

export default App;
