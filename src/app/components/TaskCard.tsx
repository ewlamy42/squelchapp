import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Link2, Folder } from "lucide-react";
import { Task, Project } from "./AppContext";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  linkedCount?: number;
  projects?: Project[];
  showProjectSelector?: boolean;
}

// Improved paper crinkling sound
const playCompletionSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = audioContext.currentTime;
  
  // Create static-like noise bursts for paper crinkling
  for (let i = 0; i < 12; i++) {
    const bufferSize = audioContext.sampleRate * 0.04; // 40ms of noise
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise with varying intensity
    const intensity = 0.15 - (i * 0.01); // Fade out over time
    for (let j = 0; j < bufferSize; j++) {
      data[j] = (Math.random() * 2 - 1) * intensity;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000 + Math.random() * 3000; // Varying high frequencies for crispness
    filter.Q.value = 0.5;
    
    const gainNode = audioContext.createGain();
    const startTime = now + (i * 0.035); // Overlapping bursts
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(intensity, startTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start(startTime);
    noise.stop(startTime + 0.04);
  }
  
  // Add final crumple with denser static burst
  const finalBufferSize = audioContext.sampleRate * 0.15;
  const finalBuffer = audioContext.createBuffer(1, finalBufferSize, audioContext.sampleRate);
  const finalData = finalBuffer.getChannelData(0);
  
  for (let i = 0; i < finalBufferSize; i++) {
    finalData[i] = (Math.random() * 2 - 1) * 0.12 * (1 - i / finalBufferSize);
  }
  
  const finalNoise = audioContext.createBufferSource();
  finalNoise.buffer = finalBuffer;
  
  const finalFilter = audioContext.createBiquadFilter();
  finalFilter.type = 'highpass';
  finalFilter.frequency.value = 1000;
  
  const finalGain = audioContext.createGain();
  const finalStart = now + 0.35;
  finalGain.gain.setValueAtTime(0.15, finalStart);
  finalGain.gain.exponentialRampToValueAtTime(0.001, finalStart + 0.15);
  
  finalNoise.connect(finalFilter);
  finalFilter.connect(finalGain);
  finalGain.connect(audioContext.destination);
  
  finalNoise.start(finalStart);
  finalNoise.stop(finalStart + 0.15);
};

export function TaskCard({ 
  task, 
  onComplete, 
  onDelete, 
  onUpdateTask,
  linkedCount = 0,
  projects = [],
  showProjectSelector = false
}: TaskCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const currentProject = projects.find(p => p.id === task.projectId);

  const handleComplete = () => {
    setIsCompleting(true);
    playCompletionSound();
    setTimeout(() => {
      onComplete(task.id);
      onDelete(task.id);
    }, 700);
  };

  const handleProjectSelect = (projectId: string | null) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { projectId });
      setShowProjects(false);
    }
  };

  if (task.completed && !isCompleting) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, rotateX: -15 }}
        animate={{
          opacity: isCompleting ? 0 : 1,
          y: isCompleting ? -150 : 0,
          x: isCompleting ? 100 : 0,
          rotateX: isCompleting ? 90 : 0,
          rotateZ: isCompleting ? -45 : 0,
          scale: isPressed ? 0.98 : isCompleting ? 0.6 : 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.5,
          rotateZ: 30,
          transition: { duration: 0.3 },
        }}
        transition={{
          type: "spring",
          stiffness: isCompleting ? 200 : 260,
          damping: isCompleting ? 15 : 20,
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className="relative group"
        style={{ zIndex: showProjects ? 101 : 1 }}
      >
        <div
          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer select-none relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
          }}
        >
          <div className="flex items-start gap-3 relative z-10">
            {/* Checkbox */}
            <button
              onClick={handleComplete}
              className="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 hover:border-indigo-500 transition-colors flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: task.completed ? "#4F46E5" : "white",
              }}
            >
              {task.completed && <Check size={14} className="text-white" />}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-gray-800 break-words"
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.5 : 1,
                }}
              >
                {task.title}
              </p>

              {/* Project Tag & Linked Items */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {/* Project Assignment Tag */}
                {showProjectSelector && (
                  <div className="relative">
                    {currentProject ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowProjects(!showProjects);
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all hover:opacity-80"
                        style={{
                          backgroundColor: `${currentProject.color}20`,
                          color: currentProject.color,
                          border: `1px solid ${currentProject.color}40`,
                        }}
                      >
                        <Folder size={11} />
                        <span>{currentProject.title}</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowProjects(!showProjects);
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all border border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 bg-gray-50"
                      >
                        <Folder size={11} />
                        <span>Add to project</span>
                      </button>
                    )}
                    
                    {/* Inline project selector - expands below */}
                    {showProjects && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 min-w-[200px] z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectSelect(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors text-gray-600 flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded border border-gray-300 flex-shrink-0" />
                          <span>None</span>
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProjectSelect(project.id);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                              task.projectId === project.id ? 'bg-indigo-50' : ''
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded flex-shrink-0"
                              style={{ backgroundColor: project.color }}
                            />
                            <span className="text-gray-700">{project.title}</span>
                            {task.projectId === project.id && (
                              <span className="ml-auto text-indigo-600">✓</span>
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}
                
                {/* Linked Items Indicator */}
                {linkedCount > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 border border-purple-200 text-xs text-purple-700">
                    <Link2 size={11} />
                    <span>{linkedCount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 rounded-lg pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Enhanced crumple animation effect */}
          {isCompleting && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0.7, 0] }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-lg"
                style={{
                  mixBlendMode: "multiply",
                }}
              />
              {/* Tear lines effect */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 1], opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-0 right-0 h-px bg-gray-600"
                style={{ transformOrigin: "left" }}
              />
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 1, 1], opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute top-1/3 left-0 right-0 h-px bg-gray-500"
                style={{ transformOrigin: "right" }}
              />
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}