import { useEffect } from "react";
import DashboardHeader from "@components/DashboardHeader";
import EventList from "@components/EventList";
import type { Event } from "types/EventType";
import type { ApiResponse } from "types/ResponseType";
import "@styles/App.css";
import { useAxios } from "@hooks/useAxios";

const App = () => {

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

  const events = apiResponse?.data || [];
  const total = Array.isArray(events) ? events.length : 0;
  const completed = Array.isArray(events) ? events.filter((e: Event) => e.complete).length : 0;
  const pending = total - completed;

  return (
    <div className="app-container" >
      <DashboardHeader total={total} completed={completed} pending={pending} />
      {loading ? <p>Loading...</p> : <EventList events={events} />}
    </div>
  );
};

export default App;
