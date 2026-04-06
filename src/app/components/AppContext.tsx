import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string | null;
  linkedTaskIds: string[];
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  linkedProjectIds: string[];
  createdAt: Date;
}

interface AppContextType {
  tasks: Task[];
  projects: Project[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11);

const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Work Projects",
    color: "#4F46E5",
    taskIds: ["task-1", "task-2", "task-3"],
    linkedProjectIds: ["proj-2"],
    createdAt: new Date("2026-04-01"),
  },
  {
    id: "proj-2",
    title: "Personal Goals",
    color: "#EC4899",
    taskIds: ["task-4", "task-5"],
    linkedProjectIds: [],
    createdAt: new Date("2026-04-02"),
  },
  {
    id: "proj-3",
    title: "Learning",
    color: "#10B981",
    taskIds: ["task-6", "task-7", "task-8"],
    linkedProjectIds: [],
    createdAt: new Date("2026-04-03"),
  },
];

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Review Q2 marketing strategy",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-04"),
  },
  {
    id: "task-2",
    title: "Update client presentation deck",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: ["task-3"],
    createdAt: new Date("2026-04-05"),
  },
  {
    id: "task-3",
    title: "Schedule follow-up meeting",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-05"),
  },
  {
    id: "task-4",
    title: "Morning workout routine",
    completed: true,
    projectId: "proj-2",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-5",
    title: "Meal prep for the week",
    completed: false,
    projectId: "proj-2",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-6",
    title: "Complete React advanced course",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: ["task-7"],
    createdAt: new Date("2026-04-04"),
  },
  {
    id: "task-7",
    title: "Build portfolio project",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-05"),
  },
  {
    id: "task-8",
    title: "Read design patterns book",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-9",
    title: "Grocery shopping",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-10",
    title: "Call dentist for appointment",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-11",
    title: "Send invoice to client",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-12",
    title: "Team standup meeting",
    completed: false,
    projectId: "proj-1",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-13",
    title: "Review pull requests",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-14",
    title: "Write blog post draft",
    completed: false,
    projectId: null,
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
  {
    id: "task-15",
    title: "Update personal website",
    completed: false,
    projectId: "proj-3",
    linkedTaskIds: [],
    createdAt: new Date("2026-04-06"),
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        projects,
        addTask,
        updateTask,
        deleteTask,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}