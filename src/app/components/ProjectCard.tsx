import React, { useMemo, useState } from "react";
import { ArrowUpRight, Folder, GripVertical, Link2, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import { type Project, type Task, useApp } from "./AppContext";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onUpdateProject?: (id: string, updates: Partial<Project>) => void;
  draggable?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLElement>, id: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLElement>, id: string) => void;
  onDrop?: (e: React.DragEvent<HTMLElement>, id: string) => void;
  onDragEnd?: (e: React.DragEvent<HTMLElement>) => void;
}

export function ProjectCard({
  project,
  tasks,
  onUpdateProject,
  draggable = false,
  isDragging = false,
  isDropTarget = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const { theme } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  const isDark = theme === "dark";

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === project.id),
    [project.id, tasks]
  );
  const completedCount = projectTasks.filter((task) => task.completed).length;
  const progress = projectTasks.length > 0 ? (completedCount / projectTasks.length) * 100 : 0;
  const recentTasks = projectTasks.slice(0, 3);

  const saveTitle = () => {
    const nextTitle = editedTitle.trim();

    if (!nextTitle) {
      setEditedTitle(project.title);
      setIsEditing(false);
      return;
    }

    if (nextTitle !== project.title && onUpdateProject) {
      onUpdateProject(project.id, { title: nextTitle });
    }

    setIsEditing(false);
  };

  return (
    <article
      onDragOver={draggable ? (e) => onDragOver?.(e, project.id) : undefined}
      onDrop={draggable ? (e) => onDrop?.(e, project.id) : undefined}
      onDragEnd={draggable ? (e) => onDragEnd?.(e) : undefined}
      onClick={() => !isEditing && navigate(`/project/${project.id}`)}
      className={`retro-panel group cursor-pointer overflow-hidden rounded-[26px] p-5 transition duration-150 hover:-translate-y-1 hover:shadow-lg${isDragging ? " opacity-40 scale-[0.98]" : ""}${isDropTarget ? " ring-4 ring-[#9250ff] ring-offset-2 scale-[1.02]" : ""}`}
      style={{
        backgroundImage: isDark
          ? `linear-gradient(155deg, rgba(26,21,80,0.98) 0%, ${project.color}33 100%)`
          : `linear-gradient(155deg, rgba(255,250,238,0.98) 0%, ${project.color}22 100%)`,
      }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        {draggable && (
          <div
            draggable
            onDragStart={(e) => {
              const card = e.currentTarget.closest('article');
              if (card) e.dataTransfer.setDragImage(card, 20, 20);
              e.stopPropagation();
              onDragStart?.(e, project.id);
            }}
            className={`mt-1 cursor-grab active:cursor-grabbing ${isDark ? "text-[#ddd4ff]" : "text-[#6e6597]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={18} />
          </div>
        )}
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${project.color}18` }}
          >
            <Folder size={22} style={{ color: project.color }} />
          </div>

          <div>
            {isEditing ? (
              <input
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                onBlur={saveTitle}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    saveTitle();
                  }

                  if (event.key === "Escape") {
                    setEditedTitle(project.title);
                    setIsEditing(false);
                  }
                }}
                onClick={(event) => event.stopPropagation()}
                className="retro-input rounded-md bg-white px-3 py-2 text-base font-black uppercase text-[#181457] outline-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h3 className={`text-lg font-black uppercase tracking-[0.03em] ${isDark ? "text-white" : "text-[#181457]"}`}>{project.title}</h3>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setEditedTitle(project.title);
                    setIsEditing(true);
                  }}
                  className={`rounded-md p-1.5 transition-colors ${isDark ? "text-[#ddd4ff] hover:bg-white/10 hover:text-white" : "text-[#6e6597] hover:bg-white/70 hover:text-[#181457]"}`}
                  aria-label="Edit project title"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <p className={`mt-1 text-sm ${isDark ? "text-[#ddd4ff]" : "text-[#4a4177]"}`}>
              {completedCount} of {projectTasks.length} tasks complete
            </p>
          </div>
        </div>

        <ArrowUpRight
          size={18}
          className={`transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isDark ? "text-[#ddd4ff] group-hover:text-white" : "text-[#6e6597] group-hover:text-[#181457]"}`}
        />
      </div>

      <div className="mb-5">
        <div className="h-3 overflow-hidden rounded-full border-2 border-[#21185b] bg-white/80">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: project.color }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-2 text-sm ${
                task.completed ? (isDark ? "text-[#a7d9c2]" : "text-[#8f88b1]") : isDark ? "text-[#f7f4ff]" : "text-[#4a4177]"
              }`}
            >
              <div
                className="mt-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className={`truncate ${task.completed ? "line-through" : ""}`}>
                {task.title}
              </span>
            </div>
          ))
        ) : (
          <div className={`rounded-[18px] border-2 border-dashed px-3 py-5 text-sm ${isDark ? "border-[#fff2a8] bg-white/5 text-[#ddd4ff]" : "border-[#21185b] bg-white/60 text-[#6e6597]"}`}>
            No tasks in this project yet.
          </div>
        )}
      </div>

      <div className={`mt-5 flex items-center justify-between border-t-2 pt-4 text-xs ${isDark ? "border-[#fff2a8]/30 text-[#ddd4ff]" : "border-[#21185b]/20 text-[#6e6597]"}`}>
        <span className={`rounded-full border-2 px-2.5 py-1 font-bold uppercase ${isDark ? "border-[#fff2a8] bg-white/5" : "border-[#21185b] bg-white/80"}`}>
          Created {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(project.createdAt))}
        </span>
        {project.linkedProjectIds.length > 0 ? (
          <span className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-1 font-bold uppercase ${isDark ? "border-[#fff2a8] bg-white/5" : "border-[#21185b] bg-white/80"}`}>
            <Link2 size={12} />
            <span>{project.linkedProjectIds.length} linked</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}
