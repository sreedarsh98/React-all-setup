import React, { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

const LS_KEY = "todo_list";

// Load safely from localStorage
const loadTodos = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Invalid localStorage JSON:", err);
    return [];
  }
};

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: task,
      completed: false,
    };

    setTodos([...todos, newTask]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    setTodos(items);
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-3">TODO List (Drag & Drop + Completed)</h3>

      <div className="d-flex gap-2 mb-3 w-50">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todoDroppable">
          {(provided) => (
            <ul
              className="list-group"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minHeight: "120px",
                padding: "10px",
                width: "50%",
              }}
            >
              {todos.map((t, index) => (
                <Draggable key={t.id} draggableId={t.id} index={index}>
                  {(provided, snapshot) => {
                    const itemRef = useRef(null);

                    return (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center"
                        ref={(el) => {
                          provided.innerRef(el);
                          itemRef.current = el;
                        }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          width: snapshot.isDragging
                            ? itemRef.current?.offsetWidth
                            : "100%",
                          maxWidth: snapshot.isDragging
                            ? itemRef.current?.offsetWidth
                            : "100%",
                          background: "white",
                          borderRadius: "4px",
                          padding: "12px",
                          margin: 0,
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => toggleComplete(t.id)}
                          />
                          <span
                            style={{
                              textDecoration: t.completed
                                ? "line-through"
                                : "none",
                              opacity: t.completed ? 0.6 : 1,
                            }}
                          >
                            {t.text}
                          </span>
                        </div>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTask(t.id)}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  }}
                </Draggable>
              ))}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
