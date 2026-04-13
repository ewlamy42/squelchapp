import { Plus } from "lucide-react";
import { useState } from "react";
import { type Project, type Task, useApp } from "./AppContext";
import { TaskCard } from "./TaskCard";

interface TaskPanelProps {
  title: string;
  description?: string;
  tasks: Task[];
  emptyLabel: string;
  color?: string;
  onAddTask?: (title: string) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  projects?: Project[];
}

export function TaskPanel({
  title,
  description,
  tasks,
  emptyLabel,
  color = "#6B7280",
  onAddTask,
  onToggleComplete,
  onDelete,
  onUpdateTask,
  projects = [],
}: TaskPanelProps) {
  const { theme } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const isDark = theme === "dark";

  const handleAddTask = () => {
    const nextTitle = newTaskTitle.trim();

    if (!nextTitle || !onAddTask) {
      setIsAdding(false);
      return;
    }

    onAddTask(nextTitle);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  return (
    <section
      className="retro-panel retro-grid rounded-[26px] p-5"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-7 w-1.5 rounded-full border border-[#1a1a1a]" style={{ backgroundColor: color }} />
            <h2 className={`text-lg font-black uppercase tracking-[0.04em] ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>{title}</h2>
            <span className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold uppercase ${isDark ? "border-[#cccccc] bg-white/5 text-[#cccccc]" : "border-[#1a1a1a] bg-white text-[#666666]"}`}>
              {tasks.length}
            </span>
          </div>
          {description ? <p className={`mt-2 text-sm ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>{description}</p> : null}
        </div>

        {onAddTask ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={`retro-button inline-flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase tracking-[0.08em] ${isDark ? "bg-[#cccccc] text-[#1a1a1a]" : "bg-white text-[#1a1a1a]"}`}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onUpdateTask={onUpdateTask}
              linkedCount={task.linkedTaskIds.length}
              projects={projects}
              showProjectSelector={Boolean(onUpdateTask)}
            />
          ))
        ) : (
          <div className={`rounded-[18px] border-2 border-dashed px-4 py-8 text-center text-sm ${isDark ? "border-[#cccccc] bg-white/5 text-[#cccccc]" : "border-[#1a1a1a] bg-white/80 text-[#666666]"}`}>
            {emptyLabel}
          </div>
        )}

        {isAdding ? (
          <div className="retro-panel rounded-[18px] p-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddTask();
                }

                if (event.key === "Escape") {
                  setIsAdding(false);
                  setNewTaskTitle("");
                }
              }}
              onBlur={handleAddTask}
              placeholder="What needs to happen next?"
              className="retro-input w-full bg-transparent px-4 py-3 text-sm text-[#1a1a1a] outline-none"
              autoFocus
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
