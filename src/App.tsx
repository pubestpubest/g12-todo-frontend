import { useState } from "react";
import axios from "axios";
import type { Task } from "./Type";
import { TaskModal } from "./components";
import "./App.css";

function App() {
  const [taskId, setTaskId] = useState("");
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    if (!taskId.trim()) {
      setError("Please enter a task ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<Task>(`/api/v1/tasks/${taskId}`);
      setTaskData(response.data);
      setIsModalOpen(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to fetch task");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTaskData(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Task Fetcher</h1>
      </header>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Task ID"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="task-input"
          onKeyDown={(e) => e.key === "Enter" && fetchTask()}
        />

        <button
          className="fetch-button"
          onClick={fetchTask}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Fetch Task"}
        </button>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        taskData={taskData}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
