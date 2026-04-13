import { useMemo, useState } from "react";
import { ArrowLeft, Grid3x3, ZoomOut, ZoomIn } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "./AppContext";
import { ThemeToggle } from "./ThemeToggle";

export function WorkspaceView() {
  const navigate = useNavigate();
  const { tasks, projects, theme } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);
  const isDark = theme === "dark";

  const projectSummaries = useMemo(
    () =>
      projects.map((project) => {
        const projectTasks = tasks.filter((task) => task.projectId === project.id);
        const completed = projectTasks.filter((task) => task.completed).length;
        const active = projectTasks.length - completed;
        const progress = projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0;

        return {
          project,
          projectTasks,
          completed,
          active,
          progress,
        };
      }),
    [projects, tasks]
  );

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a0a] text-white" : "text-slate-900"}`}>
      <header className={`sticky top-0 z-20 ${isDark ? "border-b-4 border-[#333333] bg-[#1a1a1a]" : "border-b-4 border-[#1a1a1a] bg-[#1a1a1a]"} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="retro-button rounded-full bg-[#ffffff] p-3 text-[#1a1a1a] transition hover:bg-[#f5f5f5]"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#cccccc]" : "text-[#cccccc]"}`}>
                <Grid3x3 size={18} />
                <span className="text-sm font-bold uppercase tracking-[0.18em]">
                  Workspace review
                </span>
              </div>
              <h1 className="mt-1 text-3xl font-black uppercase tracking-[0.05em] text-white">See how projects stack together</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="retro-button inline-flex items-center gap-2 rounded-full bg-[#ffffff] p-2 text-[#1a1a1a]">
            <button
              type="button"
              onClick={() => setZoomLevel((current) => Math.max(0.8, current - 0.1))}
              className={`rounded-full p-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <ZoomOut size={16} />
            </button>
            <span className="min-w-14 text-center text-sm font-bold uppercase">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((current) => Math.min(1.4, current + 0.1))}
              className={`rounded-full p-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
              <ZoomIn size={16} />
            </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Projects", value: projects.length },
            { label: "Tasks", value: tasks.length },
            { label: "Completed", value: tasks.filter((task) => task.completed).length },
            { label: "Unassigned", value: tasks.filter((task) => !task.projectId && !task.completed).length },
          ].map((item) => (
            <div key={item.label} className={`${isDark ? "retro-panel-dark" : "retro-panel"} rounded-[26px] p-5`}>
              <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>{item.label}</p>
              <p className={`mt-3 text-3xl font-black ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div
          className="origin-top-left transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {projectSummaries.map(({ project, projectTasks, completed, active, progress }, index) => (
              <article
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className={`${isDark ? "retro-panel-dark hover:border-[#cccccc]" : "retro-panel"} cursor-pointer rounded-[28px] p-6 shadow-xl transition duration-150 hover:-translate-y-1`}
                style={{
                  backgroundImage: isDark
                    ? `linear-gradient(145deg, rgba(30,30,30,0.98) 0%, ${project.color}33 100%)`
                    : `linear-gradient(145deg, rgba(255,255,255,0.98) 0%, ${project.color}22 100%)`,
                }}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className={`text-xl font-black uppercase tracking-[0.04em] ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>{project.title}</h2>
                    <p className={`mt-1 text-sm ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>
                      {active} active, {completed} completed
                    </p>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${isDark ? "border border-white" : "border border-[#1a1a1a]"}`}
                    style={{ backgroundColor: project.color }}
                  />
                </div>

                <div className="mb-5">
                  <div className={`h-3 overflow-hidden rounded-full border-2 ${isDark ? "border-[#cccccc] bg-[#111111]" : "border-[#1a1a1a] bg-white"}`}>
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                  <div className={`mt-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.08em] ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>
                    <span>{projectTasks.length} total tasks</span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {projectTasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-2xl px-3 py-2 text-sm ${
                        task.completed
                          ? isDark
                            ? "border border-[#888888] bg-[#555555]/35 text-[#e5e5e5]"
                            : "border border-[#555555] bg-[#e5e5e5] text-[#555555]"
                          : isDark
                            ? "border border-[#555555] bg-[#111111]/80 text-[#f0f0f0]"
                            : "border border-[#1a1a1a] bg-white/75 text-[#1a1a1a]"
                      }`}
                    >
                      <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                    </div>
                  ))}
                  {projectTasks.length === 0 ? (
                    <div className={`rounded-[18px] border-2 border-dashed px-3 py-6 text-center text-sm ${isDark ? "border-[#cccccc] text-[#cccccc]" : "border-[#1a1a1a] text-[#666666]"}`}>
                      No tasks yet.
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className={`${isDark ? "retro-panel-dark" : "retro-panel"} mt-10 rounded-[28px] p-6`}>
          <h2 className={`text-xl font-black uppercase tracking-[0.04em] ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>Unassigned tasks</h2>
          <p className={`mt-1 text-sm ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>
            Tasks without a project stay visible here so nothing falls out of the system.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {tasks
              .filter((task) => !task.projectId && !task.completed)
              .slice(0, 8)
              .map((task) => (
                <div
                  key={task.id}
                  className={`rounded-[18px] border-2 px-4 py-3 text-sm ${isDark ? "border-[#555555] bg-[#111111] text-[#f0f0f0]" : "border-[#1a1a1a] bg-white/75 text-[#1a1a1a]"}`}
                >
                  {task.title}
                </div>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
