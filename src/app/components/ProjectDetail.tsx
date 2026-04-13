import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Link2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { TaskCard } from "./TaskCard";
import { useApp } from "./AppContext";

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const {
    tasks,
    projects,
    addTask,
    updateTask,
    updateProject,
    deleteProject,
    deleteTask,
    toggleTaskCompletion,
  } = useApp();

  const [showCompleted, setShowCompleted] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-slate-600">Project not found.</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === project.id),
    [project.id, tasks]
  );
  const incompleteTasks = projectTasks.filter((task) => !task.completed);
  const completedTasks = projectTasks
    .filter((task) => task.completed)
    .sort(
      (left, right) =>
        new Date(right.completedAt ?? right.createdAt).getTime() -
        new Date(left.completedAt ?? left.createdAt).getTime()
    );
  const progress =
    projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;
  const linkedProjects = projects.filter((item) => project.linkedProjectIds.includes(item.id));

  const handleAddTask = () => {
    addTask({
      title: "Untitled task",
      completed: false,
      projectId: project.id,
      linkedTaskIds: [],
    });
  };

  const handleSaveTitle = () => {
    const nextTitle = editedTitle.trim();

    if (nextTitle && nextTitle !== project.title) {
      updateProject(project.id, { title: nextTitle });
    }

    setIsEditingTitle(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b-4 border-[#21185b] bg-[linear-gradient(90deg,_rgba(244,185,66,0.92),_rgba(111,243,213,0.9),_rgba(43,139,242,0.88))] backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate("/")}
                className="retro-button rounded-full bg-[#fff9ef] p-3 text-[#181457] shadow-sm transition hover:bg-[#fff6d5]"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-2xl"
                    style={{ backgroundColor: `${project.color}22` }}
                  />
                  <div>
                    {isEditingTitle ? (
                      <input
                        value={editedTitle}
                        onChange={(event) => setEditedTitle(event.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSaveTitle();
                          }

                          if (event.key === "Escape") {
                            setIsEditingTitle(false);
                          }
                        }}
                        className="retro-input w-full rounded-md bg-white px-3 py-2 text-3xl font-black uppercase text-[#181457] outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-black uppercase tracking-[0.04em] text-[#181457]">{project.title}</h1>
                        <button
                          type="button"
                          onClick={() => {
                            setEditedTitle(project.title);
                            setIsEditingTitle(true);
                          }}
                          className="rounded-md p-2 text-[#4a4177] transition-colors hover:bg-white/70 hover:text-[#181457]"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    )}
                    <p className="mt-1 text-sm text-[#312f67]">
                      Created {formatShortDate(project.createdAt)}. {completedTasks.length} completed
                      and {incompleteTasks.length} active.
                    </p>
                  </div>
                </div>

                <div className="mt-4 max-w-xl">
                  <div className="h-3 overflow-hidden rounded-full border-2 border-[#21185b] bg-white">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAddTask}
                className="retro-button inline-flex items-center gap-2 bg-[#ffef9c] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#21185b] shadow-md"
              >
                <Plus size={18} />
                <span>Add task</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(project.id);
                  navigate("/");
                }}
                className="retro-button inline-flex items-center gap-2 bg-[#ffd9e5] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#b12958] transition"
              >
                <Trash2 size={16} />
                <span>Delete project</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[1.7fr,0.9fr] sm:px-6">
        <section className="space-y-6">
          <div className="retro-panel rounded-[28px] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-black uppercase tracking-[0.04em] text-[#181457]">
                <Circle size={18} style={{ color: project.color }} />
                <span>Active tasks</span>
                <span className="rounded-full border-2 border-[#21185b] bg-white px-2.5 py-1 text-xs font-bold uppercase text-[#6e6597]">
                  {incompleteTasks.length}
                </span>
              </h2>
              <button
                type="button"
                onClick={handleAddTask}
                className="retro-button rounded-full bg-white px-3 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#181457]"
              >
                Add another
              </button>
            </div>

            <div className="space-y-3">
              {incompleteTasks.length > 0 ? (
                incompleteTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onUpdateTask={updateTask}
                    linkedCount={task.linkedTaskIds.length}
                    projects={projects}
                  />
                ))
              ) : (
                <div className="rounded-[18px] border-2 border-dashed border-[#21185b] bg-white/70 px-4 py-10 text-center text-sm text-[#6e6597]">
                  No active tasks left in this project.
                </div>
              )}
            </div>
          </div>

          <div className="retro-panel rounded-[28px] p-5">
            <button
              type="button"
              onClick={() => setShowCompleted((current) => !current)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <h2 className="flex items-center gap-2 text-lg font-black uppercase tracking-[0.04em] text-[#181457]">
                <CheckCircle2 size={18} style={{ color: project.color }} />
                <span>Completed tasks</span>
                <span className="rounded-full border-2 border-[#1f7e59] bg-[#d5ffe0] px-2.5 py-1 text-xs font-bold uppercase text-[#1f7e59]">
                  {completedTasks.length}
                </span>
              </h2>
              <MoreHorizontal size={18} className="text-[#6e6597]" />
            </button>

            {showCompleted ? (
              <div className="mt-4 space-y-3">
                {completedTasks.length > 0 ? (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskCompletion}
                      onDelete={deleteTask}
                      onUpdateTask={updateTask}
                      linkedCount={task.linkedTaskIds.length}
                      projects={projects}
                    />
                  ))
                ) : (
                  <div className="rounded-[18px] border-2 border-dashed border-[#21185b] bg-white/70 px-4 py-8 text-center text-sm text-[#6e6597]">
                    Completed work will collect here instead of disappearing.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="retro-panel rounded-[28px] p-5">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#6e6597]">
              Project snapshot
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Progress", value: `${Math.round(progress)}%` },
                { label: "Total tasks", value: String(projectTasks.length) },
                { label: "Active", value: String(incompleteTasks.length) },
                { label: "Done", value: String(completedTasks.length) },
              ].map((item) => (
                <div key={item.label} className="retro-panel rounded-[18px] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e6597]">{item.label}</p>
                  <p className="mt-2 text-2xl font-black text-[#181457]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="retro-panel rounded-[28px] p-5">
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-[#6e6597]" />
              <h3 className="font-black uppercase tracking-[0.04em] text-[#181457]">Linked projects</h3>
            </div>
            <div className="mt-4 space-y-2">
              {linkedProjects.length > 0 ? (
                linkedProjects.map((linkedProject) => {
                  const linkedTaskCount = tasks.filter(
                    (task) => task.projectId === linkedProject.id
                  ).length;

                  return (
                    <button
                      key={linkedProject.id}
                      onClick={() => navigate(`/project/${linkedProject.id}`)}
                      className="retro-panel flex w-full items-center gap-3 rounded-[18px] p-3 text-left transition duration-150 hover:translate-x-1 hover:bg-white"
                    >
                      <div
                        className="h-9 w-9 rounded-xl"
                        style={{ backgroundColor: `${linkedProject.color}26` }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold uppercase text-[#181457]">
                          {linkedProject.title}
                        </p>
                        <p className="text-xs text-[#6e6597]">{linkedTaskCount} tasks</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[18px] border-2 border-dashed border-[#21185b] bg-white/70 px-4 py-8 text-center text-sm text-[#6e6597]">
                  No linked projects yet.
                </div>
              )}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
