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

const projectPalette = ["#333333", "#666666", "#999999", "#444444", "#777777", "#555555"];

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
      className={`min-h-screen ${isDark ? "bg-[#0a0a0a] text-white" : "bg-[#f5f5f5] text-[#1a1a1a]"}`}
    >
      <nav className={`sticky top-0 z-20 ${isDark ? "border-b-4 border-[#cccccc] bg-[#1a1a1a]" : "border-b-4 border-[#1a1a1a] bg-[#1a1a1a]"} text-white shadow-[0_4px_0_rgba(0,0,0,0.15)]`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#cccccc]">
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
                className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#999999]" : "text-[#999999]"}`}
              />
              <input
                type="text"
                placeholder="Search tasks and projects"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="retro-input w-72 px-10 py-2.5 text-sm text-[#1a1a1a] outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => navigate("/workspace")}
              className="retro-button inline-flex items-center gap-2 bg-[#ffffff] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#1a1a1a]"
            >
              <Layout size={18} />
              <span className="hidden sm:inline">Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setIsQuickCaptureOpen(true)}
              className="retro-button inline-flex items-center gap-2 bg-[#e5e5e5] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#1a1a1a]"
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
                <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#cccccc]" : "text-[#1a1a1a]"}`}>Focus for today</p>
                <h2 className={`mt-2 text-3xl font-black uppercase tracking-[0.02em] ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>
                  {focusCount} active items across inbox, today, and projects.
                </h2>
                <p className={`mt-3 text-sm leading-6 ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>
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
                    <p className={`text-xs font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>{item.label}</p>
                    <p className={`mt-2 text-2xl font-black ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${isDark ? "retro-panel-dark" : "retro-panel"} rounded-[30px] p-6 retro-grid`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>Prototype controls</p>
                <h2 className={`mt-1 text-xl font-black uppercase ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>Keep testing safely</h2>
              </div>
              <button
                type="button"
                onClick={resetDemoData}
                className="retro-button inline-flex items-center gap-2 bg-[#cccccc] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[#1a1a1a]"
              >
                <RotateCcw size={16} />
                <span>Reset demo data</span>
              </button>
            </div>
            <p className={`mt-3 text-sm leading-6 ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>
              State now persists in local storage, so your edits survive refreshes. Reset puts the
              seeded sample data back if you want to re-demo flows.
            </p>
            <div className={`mt-5 rounded-[18px] border-2 border-dashed p-4 text-sm ${isDark ? "border-[#cccccc] bg-white/5 text-[#cccccc]" : "border-[#1a1a1a] bg-[#ffffff]/90 text-[#666666]"}`}>
              Search filters both task and project lists. Completed tasks stay visible in history
              instead of disappearing, so you can treat this like a real working surface.
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>Projects</p>
              <h2 className={`text-2xl font-black uppercase ${isDark ? "text-white" : "text-[#1a1a1a]"}`}>Organize work into durable threads</h2>
            </div>
            {!isAddingProject ? (
              <button
                type="button"
                onClick={() => setIsAddingProject(true)}
                className="retro-button inline-flex items-center gap-2 bg-[#1a1a1a] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#f5f5f5]"
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
                className="retro-input w-full bg-transparent px-4 py-3 text-sm text-[#1a1a1a] outline-none"
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
              <div className={`rounded-3xl border-2 border-dashed p-8 text-sm ${isDark ? "border-[#cccccc] bg-white/5 text-[#cccccc]" : "border-slate-200 bg-white text-slate-500"}`}>
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
            color="#555555"
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
            color="#888888"
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
            color="#aaaaaa"
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
        <DialogContent className="retro-panel max-w-xl border-[#1a1a1a] bg-[#f5f5f5] p-0 text-[#1a1a1a]">
          <div className="border-b-4 border-[#1a1a1a] bg-[#1a1a1a] px-6 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-[0.06em] text-white">
                Quick Capture
              </DialogTitle>
              <DialogDescription className="text-sm text-[#cccccc]">
                Drop a task into the system without losing your place.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <label
                htmlFor="quick-capture-title"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#666666]"
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
                className="retro-input w-full px-4 py-3 text-sm text-[#1a1a1a] outline-none"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="quick-capture-project"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#666666]"
              >
                Project
              </label>
              <select
                id="quick-capture-project"
                value={quickCaptureProjectId ?? ""}
                onChange={(event) =>
                  setQuickCaptureProjectId(event.target.value || null)
                }
                className="retro-input w-full appearance-none px-4 py-3 text-sm text-[#1a1a1a] outline-none"
              >
                <option value="">Inbox / no project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-[18px] border-2 border-dashed border-[#1a1a1a] bg-white/70 p-4 text-sm text-[#666666]">
              Tasks without a project land in Inbox. If you pick a project here, the task will go
              there immediately.
            </div>
          </div>

          <DialogFooter className="border-t-4 border-[#1a1a1a] bg-[#ffffff] px-6 py-4 sm:justify-between">
            <button
              type="button"
              onClick={() => {
                setIsQuickCaptureOpen(false);
                setQuickCaptureTitle("");
                setQuickCaptureProjectId(null);
              }}
              className="retro-button bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#1a1a1a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleQuickCaptureSubmit}
              className="retro-button bg-[#e5e5e5] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[#1a1a1a]"
            >
              Add task
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
