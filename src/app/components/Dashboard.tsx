import { useState } from "react";
import { motion } from "motion/react";
import { Layout, ZoomIn, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "./AppContext";
import { ProjectCard } from "./ProjectCard";
import { TaskPanel } from "./TaskPanel";

export function Dashboard() {
  const navigate = useNavigate();
  const { tasks, projects, updateTask, deleteTask, addTask, updateProject } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tasks
  const incompleteTasks = tasks.filter((t) => !t.completed);
  
  // Daily tasks (created today)
  const dailyTasks = incompleteTasks.filter((t) => {
    const taskDate = new Date(t.createdAt);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });
  
  // Unassigned tasks that are NOT in daily
  const dailyTaskIds = new Set(dailyTasks.map(t => t.id));
  const unassignedTasks = incompleteTasks.filter((t) => !t.projectId && !dailyTaskIds.has(t.id));

  const handleComplete = (id: string) => {
    updateTask(id, { completed: true });
  };

  const handleAddTask = (title?: string) => {
    addTask({
      title: title || "New task",
      completed: false,
      projectId: null,
      linkedTaskIds: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Paper</h1>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks and projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/workspace")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Layout size={18} />
                <span className="hidden md:inline">Workspace</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddTask()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Plus size={18} />
                <span className="hidden md:inline">New Task</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Projects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                tasks={tasks}
                onUpdateProject={updateProject}
              />
            ))}
          </div>
        </div>

        {/* Task Panels */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Tasks</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {/* Unassigned Tasks Panel */}
          <TaskPanel
            title="Inbox"
            tasks={unassignedTasks}
            color="#6B7280"
            onAddTask={handleAddTask}
            onComplete={handleComplete}
            onDelete={deleteTask}
            onUpdateTask={updateTask}
            projects={projects}
          />

          {/* Daily Tasks Panel */}
          <TaskPanel
            title="Daily"
            tasks={dailyTasks}
            color="#F59E0B"
            onAddTask={handleAddTask}
            onComplete={handleComplete}
            onDelete={deleteTask}
            onUpdateTask={updateTask}
            projects={projects}
          />
        </div>
      </main>
    </div>
  );
}