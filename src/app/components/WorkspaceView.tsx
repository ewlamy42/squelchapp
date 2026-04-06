import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ZoomOut, Grid3x3, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "./AppContext";

export function WorkspaceView() {
  const navigate = useNavigate();
  const { tasks, projects } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);

  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const completed = projectTasks.filter((t) => t.completed).length;
    const total = projectTasks.length;
    return { completed, total, progress: total > 0 ? (completed / total) * 100 : 0 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Top Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -4 }}
                onClick={() => navigate("/")}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div className="flex items-center gap-2">
                <Grid3x3 size={20} />
                <h1 className="text-xl font-bold">Workspace Overview</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-sm px-2">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                  className="p-1 hover:bg-slate-600 rounded transition-colors"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Canvas */}
      <div className="p-8 overflow-auto">
        <motion.div
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="origin-top-left"
        >
          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-4 gap-4 max-w-5xl">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total Projects</p>
              <p className="text-3xl font-bold">{projects.length}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total Tasks</p>
              <p className="text-3xl font-bold">{tasks.length}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold">{tasks.filter((t) => t.completed).length}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold">{tasks.filter((t) => !t.completed).length}</p>
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-3 gap-6 max-w-6xl">
            {projects.map((project, index) => {
              const stats = getProjectStats(project.id);
              const linkedProjects = projects.filter((p) =>
                project.linkedProjectIds.includes(p.id)
              );

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-500 cursor-pointer transition-all shadow-lg hover:shadow-2xl group"
                  style={{
                    background: `linear-gradient(135deg, #1e293b 0%, ${project.color}15 100%)`,
                  }}
                >
                  {/* Project Color Indicator */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                    style={{ backgroundColor: project.color }}
                  />

                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-400">
                      {stats.completed}/{stats.total} tasks
                    </p>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          className="text-slate-700"
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={project.color}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 40 - (stats.progress / 100) * 2 * Math.PI * 40,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{Math.round(stats.progress)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Task Preview */}
                  <div className="space-y-2 mb-4">
                    {tasks
                      .filter((t) => project.taskIds.includes(t.id))
                      .slice(0, 3)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="text-xs text-slate-300 flex items-center gap-2"
                          style={{
                            textDecoration: task.completed ? "line-through" : "none",
                            opacity: task.completed ? 0.5 : 1,
                          }}
                        >
                          <div
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                          <span className="truncate">{task.title}</span>
                        </div>
                      ))}
                  </div>

                  {/* Linked Projects */}
                  {linkedProjects.length > 0 && (
                    <div className="pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-2">Connected to:</p>
                      <div className="flex gap-2">
                        {linkedProjects.map((linked) => (
                          <div
                            key={linked.id}
                            className="w-6 h-6 rounded flex-shrink-0"
                            style={{ backgroundColor: `${linked.color}40` }}
                            title={linked.title}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connection Lines (visual effect) */}
                  {linkedProjects.length > 0 && (
                    <svg
                      className="absolute top-1/2 left-full w-12 h-1 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity"
                      style={{ transform: "translateY(-50%)" }}
                    >
                      <line
                        x1="0"
                        y1="2"
                        x2="48"
                        y2="2"
                        stroke={project.color}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </svg>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Unassigned Tasks Section */}
          <div className="mt-8 max-w-6xl">
            <h2 className="text-xl font-bold mb-4">Unassigned Tasks</h2>
            <div className="grid grid-cols-4 gap-3">
              {tasks
                .filter((t) => !t.projectId && !t.completed)
                .slice(0, 8)
                .map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-slate-500 transition-colors"
                  >
                    <p className="text-sm text-slate-300 truncate">{task.title}</p>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
