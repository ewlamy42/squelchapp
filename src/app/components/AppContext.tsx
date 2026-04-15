import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string | null;
  linkedTaskIds: string[];
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  color: string;
  linkedProjectIds: string[];
  createdAt: string;
}

export type ThemeMode = "light" | "dark";

interface AppContextType {
  tasks: Task[];
  projects: Project[];
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "completedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  resetDemoData: () => void;
  reorderProjects: (fromId: string, toId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const storageKey = "squelchapp-state-v1";
const themeStorageKey = "squelchapp-theme-v1";

const generateId = () => Math.random().toString(36).substring(2, 11);

const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Work Projects",
    color: "#4F46E5",
    linkedProjectIds: ["proj-2"],
    createdAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "proj-2",
    title: "Personal Goals",
    color: "#EC4899",
    linkedProjectIds: [],
    createdAt: "2026-04-02T09:00:00.000Z",
  },
  {
    id: "proj-3",
    title: "Learning",
    color: "#10B981",
    linkedProjectIds: [],
    createdAt: "2026-04-03T09:00:00.000Z",
  },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Review Q2 marketing strategy",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: "2026-04-04T09:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Update client presentation deck",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: ["task-3"],
    createdAt: "2026-04-05T09:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Schedule follow-up meeting",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: "2026-04-05T11:30:00.000Z",
  },
  {
    id: "task-4",
    title: "Morning workout routine",
    completed: true,
    projectId: "proj-2",
    linkedTaskIds: [],
    createdAt: "2026-04-06T06:45:00.000Z",
    completedAt: "2026-04-06T07:30:00.000Z",
  },
  {
    id: "task-5",
    title: "Meal prep for the week",
    completed: false,
    projectId: "proj-2",
    linkedTaskIds: [],
    createdAt: "2026-04-06T08:30:00.000Z",
  },
  {
    id: "task-6",
    title: "Complete React advanced course",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: ["task-7"],
    createdAt: "2026-04-04T13:00:00.000Z",
  },
  {
    id: "task-7",
    title: "Build portfolio project",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: [],
    createdAt: "2026-04-05T14:00:00.000Z",
  },
  {
    id: "task-8",
    title: "Read design patterns book",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: [],
    createdAt: "2026-04-06T15:00:00.000Z",
  },
  {
    id: "task-9",
    title: "Grocery shopping",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: "2026-04-06T16:00:00.000Z",
  },
  {
    id: "task-10",
    title: "Call dentist for appointment",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: "2026-04-06T16:30:00.000Z",
  },
  {
    id: "task-11",
    title: "Send invoice to client",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: "2026-04-06T17:00:00.000Z",
  },
  {
    id: "task-12",
    title: "Team standup meeting",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: "2026-04-06T17:30:00.000Z",
  },
  {
    id: "task-13",
    title: "Review pull requests",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: "2026-04-06T18:00:00.000Z",
  },
  {
    id: "task-14",
    title: "Write blog post draft",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: "2026-04-06T18:30:00.000Z",
  },
  {
    id: "task-15",
    title: "Update personal website",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: [],
    createdAt: "2026-04-06T19:00:00.000Z",
  },
];

function buildInitialState() {
  return {
    tasks: initialTasks,
    projects: initialProjects,
  };
}

function sortTasks(tasks: Task[]) {
  return [...tasks].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(buildInitialState);
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as { tasks?: Task[]; projects?: Project[] };

      if (parsed.tasks && parsed.projects) {
        setState({
          tasks: sortTasks(parsed.tasks),
          projects: parsed.projects,
        });
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    if (storedTheme === "light" || storedTheme === "dark") {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const value = useMemo<AppContextType>(
    () => ({
      tasks: state.tasks,
      projects: state.projects,
      theme,
      setTheme: (nextTheme) => setThemeState(nextTheme),
      toggleTheme: () =>
        setThemeState((current) => (current === "light" ? "dark" : "light")),
      addTask: (task) => {
        setState((current) => ({
          ...current,
          tasks: sortTasks([
            ...current.tasks,
            {
              ...task,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
          ]),
        }));
      },
      updateTask: (id, updates) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },
      toggleTaskCompletion: (id) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks.map((task) => {
            if (task.id !== id) {
              return task;
            }

            const completed = !task.completed;
            return {
              ...task,
              completed,
              completedAt: completed ? new Date().toISOString() : undefined,
            };
          }),
        }));
      },
      deleteTask: (id) => {
        setState((current) => ({
          ...current,
          tasks: current.tasks
            .filter((task) => task.id !== id)
            .map((task) => ({
              ...task,
              linkedTaskIds: task.linkedTaskIds.filter((linkedId) => linkedId !== id),
            })),
        }));
      },
      addProject: (project) => {
        setState((current) => ({
          ...current,
          projects: [
            {
              ...project,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
            ...current.projects,
          ],
        }));
      },
      updateProject: (id, updates) => {
        setState((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }));
      },
      deleteProject: (id) => {
        setState((current) => ({
          projects: current.projects
            .filter((project) => project.id !== id)
            .map((project) => ({
              ...project,
              linkedProjectIds: project.linkedProjectIds.filter((linkedId) => linkedId !== id),
            })),
          tasks: current.tasks.map((task) =>
            task.projectId === id ? { ...task, projectId: null } : task
          ),
        }));
      },
      resetDemoData: () => {
        setState(buildInitialState());
      },
      reorderProjects: (fromId, toId) => {
        setState((current) => {
          const next = [...current.projects];
          const fromIndex = next.findIndex((p) => p.id === fromId);
          const toIndex = next.findIndex((p) => p.id === toId);
          if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
            return current;
          }
          const [removed] = next.splice(fromIndex, 1);
          next.splice(toIndex, 0, removed);
          return { ...current, projects: next };
        });
      },
    }),
    [state, theme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
