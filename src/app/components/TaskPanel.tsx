import { motion } from "motion/react";
import { Plus, MoreVertical } from "lucide-react";
import { Task, Project } from "./AppContext";
import { TaskCard } from "./TaskCard";
import { useState } from "react";

interface TaskPanelProps {
  title: string;
  tasks: Task[];
  color?: string;
  onAddTask?: (title: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  projects?: Project[];
}

export function TaskPanel({
  title,
  tasks,
  color = "#6B7280",
  onAddTask,
  onComplete,
  onDelete,
  onUpdateTask,
  projects = [],
}: TaskPanelProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = () => {
    if (newTaskTitle.trim() && onAddTask) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle("");
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-gray-50 rounded-xl p-4 min-w-[320px] max-w-[400px] h-fit relative"
      style={{ zIndex: 1 }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: color }} />
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          <MoreVertical size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-3 mb-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
            onUpdateTask={onUpdateTask}
            linkedCount={task.linkedTaskIds.length}
            projects={projects}
            showProjectSelector={true}
          />
        ))}
      </div>

      {/* Add Task Button */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 text-sm"
        >
          <Plus size={16} />
          <span>Add task</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
              if (e.key === "Escape") setIsAdding(false);
            }}
            onBlur={() => {
              if (newTaskTitle.trim()) handleAddTask();
              else setIsAdding(false);
            }}
            placeholder="Task name..."
            className="w-full outline-none text-sm text-gray-800"
            autoFocus
          />
        </div>
      )}
    </motion.div>
  );
}