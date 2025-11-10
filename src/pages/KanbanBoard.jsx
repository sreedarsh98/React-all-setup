import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import "./Kanban.css";

const LS_KEY = "kanban_data_v1";

const initialData = {
  columns: {
    new: { id: "new", title: "New", taskIds: [] },
    progress: { id: "progress", title: "In Progress", taskIds: [] },
    review: { id: "review", title: "Review", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },
  columnOrder: ["new", "progress", "review", "done"],
  tasks: {},
};

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialData;
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
};

const save = (data) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
};

export default function KanbanBoard() {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setData(load());
  }, []);

  useEffect(() => {
    save(data);
  }, [data]);

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = nanoid(8);
    const newTask = { id, title: title.trim(), note: note.trim() };

    setData((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [id]: newTask },
      columns: {
        ...prev.columns,
        new: { ...prev.columns.new, taskIds: [id, ...prev.columns.new.taskIds] },
      },
    }));

    setTitle("");
    setNote("");
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startCol = data.columns[source.droppableId];
    const endCol = data.columns[destination.droppableId];

    // Reorder inside same column
    if (startCol === endCol) {
      const newTaskIds = Array.from(startCol.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startCol, taskIds: newTaskIds };

      setData((prev) => ({
        ...prev,
        columns: { ...prev.columns, [newColumn.id]: newColumn },
      }));
      return;
    }

    // Move to another column
    const startTaskIds = Array.from(startCol.taskIds);
    startTaskIds.splice(source.index, 1);

    const endTaskIds = Array.from(endCol.taskIds);
    endTaskIds.splice(destination.index, 0, draggableId);

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [startCol.id]: { ...startCol, taskIds: startTaskIds },
        [endCol.id]: { ...endCol, taskIds: endTaskIds },
      },
    }));
  };

  const removeTask = (taskId, colId) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const newTaskIds = data.columns[colId].taskIds.filter((id) => id !== taskId);

    setData((prev) => ({
      ...prev,
      tasks: newTasks,
      columns: {
        ...prev.columns,
        [colId]: { ...prev.columns[colId], taskIds: newTaskIds },
      },
    }));
  };

  return (
    <div className="kanban-app">
      <h1 className="kanban-title">Kanban Board</h1>

      <form className="kanban-form" onSubmit={addTask}>
        <input
          className="kanban-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          className="kanban-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Task note (optional)"
        />
        <button className="kanban-btn">Add</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {data.columnOrder.map((colId) => {
            const column = data.columns[colId];
            const tasks = column.taskIds.map((id) => data.tasks[id]);

            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => (
                  <div
                    className={`kanban-column ${
                      snapshot.isDraggingOver ? "drag-over" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="kanban-column-header">
                      {column.title}
                      <span className="count">{tasks.length}</span>
                    </div>

                    <div className="kanban-column-body">
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => {
                            const cardRef = useRef(null);

                            return (
                              <div
                                className={`kanban-card ${
                                  snapshot.isDragging ? "dragging" : ""
                                }`}
                                ref={(el) => {
                                  provided.innerRef(el);
                                  cardRef.current = el;
                                }}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  width: snapshot.isDragging
                                    ? cardRef.current?.offsetWidth
                                    : "100%",
                                  maxWidth: snapshot.isDragging
                                    ? cardRef.current?.offsetWidth
                                    : "100%",
                                }}
                              >
                                <div className="kanban-card-title">{task.title}</div>
                                {task.note && (
                                  <div className="kanban-card-note">{task.note}</div>
                                )}

                                <button
                                  className="delete-btn"
                                  onClick={() => removeTask(task.id, column.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
