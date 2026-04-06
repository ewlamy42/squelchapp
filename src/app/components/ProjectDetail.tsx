import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Link2, Plus, MoreVertical, CheckCircle2, Circle, Edit2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "./AppContext";
import { TaskCard } from "./TaskCard";

export function ProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { tasks, projects, updateTask, deleteTask, addTask, updateProject } = useApp();
  const [showCompleted, setShowCompleted] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => project.taskIds.includes(t.id));
  const incompleteTasks = projectTasks.filter((t) => !t.completed);
  const completedTasks = projectTasks.filter((t) => t.completed);
  const completedCount = completedTasks.length;
  const totalCount = projectTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const linkedProjects = projects.filter((p) => project.linkedProjectIds.includes(p.id));

  const handleComplete = (id: string) => {
    updateTask(id, { completed: true });
  };

  const handleAddTask = () => {
    addTask({
      title: "New task",
      completed: false,
      projectId: project.id,
      linkedTaskIds: [],
    });
  };

  const handleTitleClick = () => {
    setEditedTitle(project.title);
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== project.title) {
      updateProject(project.id, { title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </motion.button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: project.color }} />
                </div>
                <div>
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleTitleSave();
                        if (e.key === "Escape") setIsEditingTitle(false);
                      }}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2 group/title">
                      <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                      <button
                        onClick={handleTitleClick}
                        className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 size={16} className="text-gray-400" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    {completedCount} of {totalCount} tasks completed
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: project.color }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTask}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Plus size={18} />
                <span>Add Task</span>
              </motion.button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Tasks */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Circle size={18} style={{ color: project.color }} />
                Active Tasks ({incompleteTasks.length})
              </h2>
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleComplete}
                    onDelete={deleteTask}
                    onUpdateTask={updateTask}
                    linkedCount={task.linkedTaskIds.length}
                    projects={projects}
                    showProjectSelector={false}
                  />
                ))}
                {incompleteTasks.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-2">No active tasks</p>
                    <button
                      onClick={handleAddTask}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Add your first task
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <CheckCircle2 size={18} style={{ color: project.color }} />
                  <span className="text-lg font-semibold">
                    Completed ({completedTasks.length})
                  </span>
                </button>
                {showCompleted && (
                  <div className="space-y-3 opacity-60">
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleComplete}
                        onDelete={deleteTask}
                        linkedCount={task.linkedTaskIds.length}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-gray-900">
                      {progress === 100 ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Progress</p>
                  <p className="text-gray-900 font-semibold">{Math.round(progress)}%</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Tasks</p>
                  <p className="text-gray-900">
                    {incompleteTasks.length} active, {completedCount} completed
                  </p>
                </div>
              </div>
            </div>

            {/* Linked Projects */}
            {linkedProjects.length > 0 && (
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 size={16} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Linked Projects</h3>
                </div>
                <div className="space-y-2">
                  {linkedProjects.map((linkedProj) => (
                    <motion.button
                      key={linkedProj.id}
                      whileHover={{ x: 4 }}
                      onClick={() => navigate(`/project/${linkedProj.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${linkedProj.color}30` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {linkedProj.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {linkedProj.taskIds.length} tasks
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-sm text-gray-700">
                  Link to another project
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-sm text-gray-700">
                  Export tasks
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-sm text-gray-700">
                  Archive project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}