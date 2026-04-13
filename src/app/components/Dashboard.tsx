import { useMemo, useState } from "react";
import { FolderPlus, Layout, Plus, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { ProjectCard } from "./ProjectCard";
import { TaskPanel } from "./TaskPanel";
import { useApp } from "./AppContext";
import { ThemeToggle } from "./ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const projectPalette = ["#4F46E5", "#EC4899", "#10B981", "#F59E0B", "#0EA5E9", "#8B5CF6"];

function isSameDay(left: string, right: Date) {
  const date = new Date(left);
  return date.toDateString() === right.toDateString();
}

export function Dashboard() {
  const navigate = useNavigate();
  const {
    tasks,
    projects,
    theme,
    addTask,
    addProject,
    updateTask,
    updateProject,
    toggleTaskCompletion,
    deleteTask,
    resetDemoData,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [quickCaptureTitle, setQuickCaptureTitle] = useState("");
  const [quickCaptureProjectId, setQuickCaptureProjectId] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const today = new Date();
  const isDark = theme === "dark";

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        [
          task.title,
          task.projectId ?? "",
          task.completed ? "completed" : "active",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      ),
    [normalizedQuery, tasks]
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.title.toLowerCase().includes(normalizedQuery)
      ),
    [normalizedQuery, projects]
  );

  const todayTasks = filteredTasks.filter(
    (task) => !task.completed && isSameDay(task.createdAt, today)
  );
  const inboxTasks = filteredTasks.filter(
    (task) => !task.completed && !task.projectId && !isSameDay(task.createdAt, today)
  );
  const activeProjectTasks = filteredTasks.filter((task) => !task.completed && task.projectId);
  const completedTasks = filteredTasks
    .filter((task) => task.completed)
    .sort(
      (left, right) =>
        new Date(right.completedAt ?? right.createdAt).getTime() -
        new Date(left.completedAt ?? left.createdAt).getTime()
    )
    .slice(0, 6);

  const projectCards = filteredProjects.map((project) => ({
    project,
    taskCount: tasks.filter((task) => task.projectId === project.id).length,
  }));

  const focusCount = filteredTasks.filter((task) => !task.completed).length;

  const handleAddInboxTask = (title: string) => {
    addTask({
      title,
      completed: false,
      projectId: null,
      linkedTaskIds: [],
    });
  };

  const handleQuickCaptureSubmit = () => {
    const title = quickCaptureTitle.trim();

    if (!title) {
      return;
    }

    addTask({
      title,
      completed: false,
      projectId: quickCaptureProjectId,
      linkedTaskIds: [],
    });

    setQuickCaptureTitle("");
    setQuickCaptureProjectId(null);
    setIsQuickCaptureOpen(false);
  };

  const handleAddProject = () => {
    const title = newProjectTitle.trim();

    if (!title) {
      setIsAddingProject(false);
      return;
    }

    addProject({
      title,
      color: projectPalette[projects.length % projectPalette.length],
      linkedProjectIds: [],
    });
    setNewProjectTitle("");
    setIsAddingProject(false);
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[radial-gradient(circle_at_top,_rgba(146,80,255,0.28),_transparent_25%),linear-gradient(180deg,_#24156c,_#0f123b_58%,_#090a24)] text-white" : "text-slate-900"}`}
    >
      <nav className={`sticky top-0 z-20 ${isDark ? "border-b-4 border-[#ffef9c] bg-[linear-gradient(90deg,_rgba(24,20,87,0.96),_rgba(35,71,216,0.92),_rgba(146,80,255,0.88))]" : "border-b-4 border-[#21185b] bg-[linear-gradient(90deg,_rgba(43,139,242,0.9),_rgba(146,80,255,0.88),_rgba(239,91,127,0.86))]"} text-white shadow-[0_4px_0_rgba(24,20,87,0.22)]`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fff2a8]">
              Squelch
            </p>
            <h1 className="mt-1 text-3xl font-black uppercase tracking-[0.06em] text-white">
              Capture, sort, focus.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <label className="relative hidden md:block">
              <Search
                size={18}
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#51468f]" : "text-[#51468f]"}`}
              />
              <input
                type="text"
                placeholder="Search tasks and projects"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="retro-input w-72 px-10 py-2.5 text-sm text-[#181457] outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => navigate("/workspace")}
              className="retro-button inline-flex items-center gap-2 bg-[#fff9ef] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#181457]"
            >
              <Layout size={18} />
              <span className="hidden sm:inline">Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setIsQuickCaptureOpen(true)}
              className="retro-button inline-flex items-center gap-2 bg-[#ffef9c] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#21185b]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Quick capture</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <section className="grid gap-5 lg:grid-cols-[1.4fr,1fr]">
          <div className="retro-shell rounded-[30px] p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#fff2a8]" : "text-[#2347d8]"}`}>Focus for today</p>
                <h2 className={`mt-2 text-3xl font-black uppercase tracking-[0.02em] ${isDark ? "text-white" : "text-[#181457]"}`}>
                  {focusCount} active items across inbox, today, and projects.
                </h2>
                <p className={`mt-3 text-sm leading-6 ${isDark ? "text-[#ddd4ff]" : "text-[#4a4177]"}`}>
                  Use Inbox for raw capture, Today for immediate work, and Projects for longer arcs.
                  The workspace view is now a secondary review surface instead of the main workflow.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Inbox", value: inboxTasks.length },
                  { label: "Today", value: todayTasks.length },
                  { label: "Projects", value: projects.length },
                  { label: "Done", value: tasks.filter((task) => task.completed).length },
                ].map((item) => (
                <div
                  key={item.label}
                  className={`${isDark ? "retro-panel-dark" : "retro-panel"} rounded-[18px] px-4 py-3 text-center`}
                >
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#fff2a8]" : "text-[#6e6597]"}`}>{item.label}</p>
                    <p className={`mt-2 text-2xl font-black ${isDark ? "text-white" : "text-[#181457]"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${isDark ? "retro-panel-dark" : "retro-panel"} rounded-[30px] p-6 retro-grid`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#fff2a8]" : "text-[#6e6597]"}`}>Prototype controls</p>
                <h2 className={`mt-1 text-xl font-black uppercase ${isDark ? "text-white" : "text-[#181457]"}`}>Keep testing safely</h2>
              </div>
              <button
                type="button"
                onClick={resetDemoData}
                className="retro-button inline-flex items-center gap-2 bg-[#6ff3d5] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#14346f]"
              >
                <RotateCcw size={16} />
                <span>Reset demo data</span>
              </button>
            </div>
            <p className={`mt-3 text-sm leading-6 ${isDark ? "text-[#ddd4ff]" : "text-[#4a4177]"}`}>
              State now persists in local storage, so your edits survive refreshes. Reset puts the
              seeded sample data back if you want to re-demo flows.
            </p>
            <div className={`mt-5 rounded-[18px] border-2 border-dashed p-4 text-sm ${isDark ? "border-[#fff2a8] bg-white/5 text-[#ddd4ff]" : "border-[#21185b] bg-[#fff9ef]/90 text-[#4a4177]"}`}>
              Search filters both task and project lists. Completed tasks stay visible in history
              instead of disappearing, so you can treat this like a real working surface.
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#fff2a8]" : "text-[#6e6597]"}`}>Projects</p>
              <h2 className={`text-2xl font-black uppercase ${isDark ? "text-white" : "text-[#181457]"}`}>Organize work into durable threads</h2>
            </div>
            {!isAddingProject ? (
              <button
                type="button"
                onClick={() => setIsAddingProject(true)}
                className="retro-button inline-flex items-center gap-2 bg-[#181457] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#fff9ef]"
              >
                <FolderPlus size={18} />
                <span>New project</span>
              </button>
            ) : null}
          </div>

          {isAddingProject ? (
            <div className="retro-panel mb-5 rounded-[22px] p-4">
              <input
                type="text"
                value={newProjectTitle}
                onChange={(event) => setNewProjectTitle(event.target.value)}
                onBlur={handleAddProject}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddProject();
                  }

                  if (event.key === "Escape") {
                    setNewProjectTitle("");
                    setIsAddingProject(false);
                  }
                }}
                placeholder="Name a new project"
                className="retro-input w-full bg-transparent px-4 py-3 text-sm text-[#181457] outline-none"
                autoFocus
              />
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectCards.length > 0 ? (
              projectCards.map(({ project }) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasks}
                  onUpdateProject={updateProject}
                />
              ))
            ) : (
              <div className={`rounded-3xl border-2 border-dashed p-8 text-sm ${isDark ? "border-[#fff2a8] bg-white/5 text-[#ddd4ff]" : "border-slate-200 bg-white text-slate-500"}`}>
                No projects match your current search.
              </div>
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-5 xl:grid-cols-[1fr,1fr,1fr]">
          <TaskPanel
            title="Inbox"
            description="Raw capture and items that still need a home."
            tasks={inboxTasks}
            emptyLabel="Your inbox is clear. Add a task or drag something back from a project."
            color="#2b8bf2"
            onAddTask={handleAddInboxTask}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdateTask={updateTask}
            projects={projects}
          />

          <TaskPanel
            title="Today"
            description="Freshly added items that probably deserve immediate attention."
            tasks={todayTasks}
            emptyLabel="Nothing newly captured today yet."
            color="#f4b942"
            onAddTask={handleAddInboxTask}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdateTask={updateTask}
            projects={projects}
          />

          <TaskPanel
            title="Recently done"
            description="Completion history stays visible so you can review and restore."
            tasks={completedTasks}
            emptyLabel="Complete something to build momentum."
            color="#26c48f"
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
            onUpdateTask={updateTask}
            projects={projects}
          />
        </section>
      </main>

      <Dialog
        open={isQuickCaptureOpen}
        onOpenChange={(open) => {
          setIsQuickCaptureOpen(open);

          if (!open) {
            setQuickCaptureTitle("");
            setQuickCaptureProjectId(null);
          }
        }}
      >
        <DialogContent className="retro-panel max-w-xl border-[#21185b] bg-[#fff5d8] p-0 text-[#181457]">
          <div className="border-b-4 border-[#21185b] bg-[linear-gradient(90deg,_#2b8bf2,_#9250ff,_#ef5b7f)] px-6 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-[0.06em] text-white">
                Quick Capture
              </DialogTitle>
              <DialogDescription className="text-sm text-[#fff6d5]">
                Drop a task into the system without losing your place.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <label
                htmlFor="quick-capture-title"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#6e6597]"
              >
                Task title
              </label>
              <input
                id="quick-capture-title"
                value={quickCaptureTitle}
                onChange={(event) => setQuickCaptureTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleQuickCaptureSubmit();
                  }
                }}
                placeholder="What needs to happen next?"
                className="retro-input w-full px-4 py-3 text-sm text-[#181457] outline-none"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="quick-capture-project"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#6e6597]"
              >
                Project
              </label>
              <select
                id="quick-capture-project"
                value={quickCaptureProjectId ?? ""}
                onChange={(event) =>
                  setQuickCaptureProjectId(event.target.value || null)
                }
                className="retro-input w-full appearance-none px-4 py-3 text-sm text-[#181457] outline-none"
              >
                <option value="">Inbox / no project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[18px] border-2 border-dashed border-[#21185b] bg-white/70 p-4 text-sm text-[#4a4177]">
              Tasks without a project land in Inbox. If you pick a project here, the task will go
              there immediately.
            </div>
          </div>

          <DialogFooter className="border-t-4 border-[#21185b] bg-[#fff9ef] px-6 py-4 sm:justify-between">
            <button
              type="button"
              onClick={() => {
                setIsQuickCaptureOpen(false);
                setQuickCaptureTitle("");
                setQuickCaptureProjectId(null);
              }}
              className="retro-button bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#181457]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleQuickCaptureSubmit}
              className="retro-button bg-[#ffef9c] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#21185b]"
            >
              Add task
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
