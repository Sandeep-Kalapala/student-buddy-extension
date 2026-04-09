import React, { useState, useEffect } from "react";
import "./App.css";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Load tasks from Chrome storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("student-buddy-tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save tasks to localStorage on every change
  useEffect(() => {
    localStorage.setItem("student-buddy-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
  console.log("ADD BUTTON CLICKED");
  console.log("TEXT VALUE:", text);
  if (!text.trim()) return;

  const newTask = {
  id: Date.now().toString(),
  text,
  completed: false,
  priority,
  dueDate
};
  setTasks((prev) => [...prev, newTask]);

  console.log("dueDate BEFORE:", dueDate);

  if (dueDate) {
    const dueTime = new Date(dueDate).getTime();

    console.log("Creating alarm for:", new Date(dueTime));

    chrome.alarms.create(newTask.text, {
      when: dueTime
    });

    console.log("Alarm set!");
  } else {
    console.log("No due date provided");
  }

  setText("");
};

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const priorityColor: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Student Buddy</h1>
        <span className="task-count">{tasks.filter((t) => !t.completed).length} remaining</span>
      </header>

      <div className="input-section">
        <input
  className="task-input"
  placeholder="Add a new task..."
  value={text}
  onChange={(e) => {
    console.log("TEXT INPUT:", e.target.value);
    setText(e.target.value);
  }}
/>
        <div className="input-row">
          <input
            className="date-input"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => {
            console.log("INPUT CHANGED:", e.target.value);
            setDueDate(e.target.value);
          }}
/>
          <select
           className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <button className="add-btn" onClick={addTask}>Add</button>
        </div>
      </div>

      <div className="filter-bar">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="task-list">
        {filteredTasks.length === 0 && (
          <li className="empty">No tasks here 🎉</li>
        )}
        {filteredTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? "done" : ""}`}>
            <div className="task-left">
              <span
                className="priority-dot"
                style={{ background: priorityColor[task.priority] }}
              />
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <div className="task-info">
                <span className="task-text">{task.text}</span>
                {task.dueDate && (
                  <span className="task-due">📅 {task.dueDate}</span>
                )}
              </div>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
          </li>
        ))}
      </ul>

      <footer className="footer">
        <button className="clear-btn" onClick={() => setTasks((p) => p.filter((t) => !t.completed))}>
          Clear completed
        </button>
      </footer>
    </div>
  );
};

export default App;
