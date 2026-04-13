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
    <div className={`min-h-screen ${isDark ? "bg-[radial-gradient(circle_at_top,_rgba(146,80,255,0.28),_transparent_25%),linear-gradient(180deg,_#24156c,_#0f123b_58%,_#090a24)] text-white" : "text-slate-900"}`}>
      <header className={`sticky top-0 z-20 ${isDark ? "border-b-4 border-[#ffef9c] bg-[linear-gradient(90deg,_rgba(24,20,87,0.96),_rgba(35,71,216,0.92),_rgba(146,80,255,0.88))]" : "border-b-4 border-[#21185b] bg-[linear-gradient(90deg,_rgba(43,139,242,0.9),_rgba(146,80,255,0.88),_rgba(239,91,127,0.86))]"} backdrop-blur-xl`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="retro-button rounded-full bg-[#fff9ef] p-3 text-[#181457] transition hover:bg-[#fff6d5]"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className={`flex items-center gap-2 ${isDark ? "text-[#fff2a8]" : "text-[#fff2a8]"}`}>
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
            <div className="retro-button inline-flex items-center gap-2 rounded-full bg-[#fff9ef] p-2 text-[#181457]">
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
              <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#fff2a8]" : "text-[#6e6597]"}`}>{item.label}</p>
              <p className={`mt-3 text-3xl font-black ${isDark ? "text-white" : "text-[#181457]"}`}>{item.value}</p>
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
                className={`${isDark ? "retro-panel-dark hover:border-[#fff2a8]" : "retro-panel"} cursor-pointer rounded-[28px] p-6 shadow-xl transition duration-150 hover:-translate-y-1`}
                style={{
                  backgroundImage: isDark
                    ? `linear-gradient(145deg, rgba(26,21,80,0.98) 0%, ${project.color}33 100%)`
                    : `linear-gradient(145deg, rgba(255,250,238,0.98) 0%, ${project.color}22 100%)`,
                }}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className={`text-xl font-black uppercase tracking-[0.04em] ${isDark ? "text-white" : "text-[#181457]"}`}>{project.title}</h2>
                    <p className={`mt-1 text-sm ${isDark ? "text-[#ddd4ff]" : "text-[#4a4177]"}`}>
                      {active} active, {completed} completed
                    </p>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full ${isDark ? "border border-white" : "border border-[#21185b]"}`}
                    style={{ backgroundColor: project.color }}
                  />
                </div>

                <div className="mb-5">
                  <div className={`h-3 overflow-hidden rounded-full border-2 ${isDark ? "border-[#fff2a8] bg-[#0f123b]" : "border-[#21185b] bg-white"}`}>
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: `${progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                  <div className={`mt-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.08em] ${isDark ? "text-[#ddd4ff]" : "text-[#6e6597]"}`}>
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
                            ? "border border-[#7ef0b7] bg-[#0d6c52]/35 text-[#d8ffea]"
                            : "border border-[#2d7f57] bg-[#d5ffe0] text-[#1f7e59]"
                          : isDark
                            ? "border border-[#5f55c9] bg-[#12184f]/80 text-[#f7f4ff]"
                            : "border border-[#21185b] bg-white/75 text-[#181457]"
                      }`}
                    >
                      <span className={task.completed ? "line-through" : ""}>{task.title}</span>
                    </div>
                  ))}
                  {projectTasks.length === 0 ? (
                    <div className={`rounded-[18px] border-2 border-dashed px-3 py-6 text-center text-sm ${isDark ? "border-[#fff2a8] text-[#ddd4ff]" : "border-[#21185b] text-[#6e6597]"}`}>
                      No tasks yet.
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className={`${isDark ? "retro-panel-dark" : "retro-panel"} mt-10 rounded-[28px] p-6`}>
          <h2 className={`text-xl font-black uppercase tracking-[0.04em] ${isDark ? "text-white" : "text-[#181457]"}`}>Unassigned tasks</h2>
          <p className={`mt-1 text-sm ${isDark ? "text-[#ddd4ff]" : "text-[#4a4177]"}`}>
            Tasks without a project stay visible here so nothing falls out of the system.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {tasks
              .filter((task) => !task.projectId && !task.completed)
              .slice(0, 8)
              .map((task) => (
                <div
                  key={task.id}
                  className={`rounded-[18px] border-2 px-4 py-3 text-sm ${isDark ? "border-[#5f55c9] bg-[#101445] text-[#f7f4ff]" : "border-[#21185b] bg-white/75 text-[#181457]"}`}
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
