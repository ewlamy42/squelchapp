import { motion } from "motion/react";
import { Folder, Link2, ChevronRight, Edit2 } from "lucide-react";
import { Project, Task } from "./AppContext";
import { useNavigate } from "react-router";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onUpdateProject?: (id: string, updates: Partial<Project>) => void;
}

export function ProjectCard({ project, tasks, onDragStart, onDragEnd, onUpdateProject }: ProjectCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  
  const projectTasks = tasks.filter((t) => t.id && project.taskIds.includes(t.id));
  const completedCount = projectTasks.filter((t) => t.completed).length;
  const totalCount = projectTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const recentTasks = projectTasks.slice(0, 3);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== project.title && onUpdateProject) {
      onUpdateProject(project.id, { title: editedTitle.trim() });
    } else {
      setEditedTitle(project.title);
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => !isEditing && navigate(`/project/${project.id}`)}
      className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer group relative overflow-hidden"
      style={{
        background: `linear-gradient(145deg, white 0%, ${project.color}08 100%)`,
      }}
    >
      {/* Ruled Lines Background - like memo paper */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-[1px] opacity-20"
            style={{
              top: `${55 + i * 28}px`,
              backgroundColor: project.color,
            }}
          />
        ))}
        {/* Vertical margin line - positioned after icon */}
        <div
          className="absolute top-0 bottom-0 w-[1px] opacity-8"
          style={{
            left: "56px",
            backgroundColor: project.color,
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <Folder size={20} style={{ color: project.color }} />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setEditedTitle(project.title);
                    setIsEditing(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-gray-900 border-b-2 border-indigo-500 outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                <button
                  onClick={handleTitleClick}
                  className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                >
                  <Edit2 size={14} className="text-gray-400" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">
              {completedCount}/{totalCount} tasks
            </p>
          </div>
        </div>
        <ChevronRight
          size={20}
          className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"
        />
      </div>

      {/* Progress Bar */}
      <div className="mb-4 relative z-10">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Recent Tasks Preview */}
      <div className="space-y-2 mb-3 relative z-10">
        {recentTasks.map((task) => (
          <div
            key={task.id}
            className="text-sm text-gray-600 flex items-start gap-2"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              opacity: task.completed ? 0.5 : 1,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <span className="truncate">{task.title}</span>
          </div>
        ))}
        {totalCount > 3 && (
          <p className="text-xs text-gray-400 pl-3.5">+{totalCount - 3} more tasks</p>
        )}
      </div>

      {/* Linked Projects */}
      {project.linkedProjectIds.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500 pt-3 border-t border-gray-100 relative z-10">
          <Link2 size={12} />
          <span>{project.linkedProjectIds.length} linked project(s)</span>
        </div>
      )}
    </motion.div>
  );
}