import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Folder, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { type Project, type Task, useApp } from "./AppContext";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  linkedCount?: number;
  projects?: Project[];
  showProjectSelector?: boolean;
}

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function playRipSound() {
  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) {
    return;
  }

  const audioContext = new AudioContextCtor();
  const now = audioContext.currentTime;

  for (let burst = 0; burst < 5; burst += 1) {
    const duration = 0.04 + burst * 0.015;
    const bufferSize = Math.floor(audioContext.sampleRate * duration);
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < bufferSize; index += 1) {
      const envelope = 1 - index / bufferSize;
      data[index] = (Math.random() * 2 - 1) * envelope * (0.24 - burst * 0.03);
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const filter = audioContext.createBiquadFilter();
    filter.type = burst % 2 === 0 ? "highpass" : "bandpass";
    filter.frequency.value = 1200 + burst * 380;
    filter.Q.value = 0.6;

    const gain = audioContext.createGain();
    const startAt = now + burst * 0.035;
    gain.gain.setValueAtTime(0.001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.16, startAt + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    source.start(startAt);
    source.stop(startAt + duration);
  }

  const tailOscillator = audioContext.createOscillator();
  const tailGain = audioContext.createGain();
  tailOscillator.type = "triangle";
  tailOscillator.frequency.setValueAtTime(180, now + 0.06);
  tailOscillator.frequency.exponentialRampToValueAtTime(90, now + 0.22);
  tailGain.gain.setValueAtTime(0.001, now + 0.06);
  tailGain.gain.exponentialRampToValueAtTime(0.03, now + 0.08);
  tailGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  tailOscillator.connect(tailGain);
  tailGain.connect(audioContext.destination);
  tailOscillator.start(now + 0.06);
  tailOscillator.stop(now + 0.22);
}

export function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onUpdateTask,
  linkedCount = 0,
  projects = [],
  showProjectSelector = false,
}: TaskCardProps) {
  const { theme } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [showProjects, setShowProjects] = useState(false);
  const [isTearing, setIsTearing] = useState(false);
  const tearTimeoutRef = useRef<number | null>(null);
  const isDark = theme === "dark";

  const currentProject = useMemo(
    () => projects.find((project) => project.id === task.projectId),
    [projects, task.projectId]
  );
  const tearSurfaceStyle = {
    ...(isDark
      ? {
          backgroundImage: task.completed
            ? "linear-gradient(180deg, rgba(13,108,82,0.42), rgba(14,50,43,0.92))"
            : "linear-gradient(180deg, rgba(28,23,94,0.98), rgba(18,15,53,0.95))",
        }
      : {}),
  };

  const saveTitle = () => {
    const nextTitle = draftTitle.trim();

    if (!nextTitle) {
      setDraftTitle(task.title);
      setIsEditing(false);
      return;
    }

    if (nextTitle !== task.title && onUpdateTask) {
      onUpdateTask(task.id, { title: nextTitle });
    }

    setIsEditing(false);
  };

  useEffect(() => {
    return () => {
      if (tearTimeoutRef.current) {
        window.clearTimeout(tearTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleComplete = () => {
    if (task.completed) {
      onToggleComplete(task.id);
      return;
    }

    setIsTearing(true);
    playRipSound();

    tearTimeoutRef.current = window.setTimeout(() => {
      onToggleComplete(task.id);
      setIsTearing(false);
      tearTimeoutRef.current = null;
    }, 360);
  };

  const renderCardContent = (fragment = false) => (
    <div className={`flex items-start gap-3 ${fragment ? "pointer-events-none" : ""}`}>
      <button
        type="button"
        aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
        onClick={handleToggleComplete}
        disabled={isTearing || fragment}
        className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
          task.completed
            ? "border-[#1f7e59] bg-[#26c48f] text-white"
            : isDark
              ? "border-[#fff2a8] bg-[#0f123b] text-transparent hover:border-[#6ff3d5]"
              : "border-[#21185b] bg-white text-transparent hover:border-[#2347d8]"
        } ${isTearing ? "opacity-70" : ""}`}
      >
        <Check size={14} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {isEditing && !fragment ? (
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                onBlur={saveTitle}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    saveTitle();
                  }

                  if (event.key === "Escape") {
                    setDraftTitle(task.title);
                    setIsEditing(false);
                  }
                }}
                className="retro-input w-full rounded-md bg-white px-3 py-2 text-sm font-bold text-[#181457] outline-none ring-0"
                autoFocus
              />
            ) : (
              <p
                className={`text-sm leading-6 transition-transform duration-300 ${
                  task.completed
                    ? isDark
                      ? "text-[#c9ffe0] line-through"
                      : "text-[#537663] line-through"
                    : isDark
                      ? "text-[#f7f4ff]"
                      : "text-[#181457]"
                } ${isTearing ? "translate-x-1" : ""}`}
              >
                {isEditing && fragment ? draftTitle : task.title}
              </p>
            )}

            <div className={`mt-2 flex flex-wrap items-center gap-2 text-xs ${isDark ? "text-[#ddd4ff]" : "text-[#6e6597]"}`}>
              <span className={`rounded-full border-2 px-2 py-1 font-bold uppercase ${isDark ? "border-[#fff2a8] bg-white/5" : "border-[#21185b] bg-white"}`}>
                Added {formatWhen(task.createdAt)}
              </span>
              {task.completedAt ? (
                <span className="rounded-full border-2 border-[#1f7e59] bg-[#d5ffe0] px-2 py-1 font-bold uppercase text-[#1f7e59]">
                  Done {formatWhen(task.completedAt)}
                </span>
              ) : null}
              {linkedCount > 0 ? (
                <span className="rounded-full border-2 border-[#21185b] bg-[#fbc7ff] px-2 py-1 font-bold uppercase text-[#4d257e]">
                  {linkedCount} linked
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!task.completed && onUpdateTask ? (
              <button
                type="button"
                onClick={() => {
                  setDraftTitle(task.title);
                  setIsEditing(true);
                }}
                disabled={fragment}
                className={`rounded-md p-2 transition-colors ${isDark ? "text-[#ddd4ff] hover:bg-white/10 hover:text-white" : "text-[#6e6597] hover:bg-white hover:text-[#181457]"}`}
                aria-label="Edit task"
              >
                <Pencil size={14} />
              </button>
            ) : null}
            {task.completed ? (
              <button
                type="button"
                onClick={() => onToggleComplete(task.id)}
                disabled={fragment}
                className={`rounded-md p-2 transition-colors ${isDark ? "text-[#ddd4ff] hover:bg-white/10 hover:text-white" : "text-[#6e6597] hover:bg-white hover:text-[#181457]"}`}
                aria-label="Restore task"
              >
                <RotateCcw size={14} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              disabled={fragment}
              className={`rounded-md p-2 transition-colors ${isDark ? "text-[#ddd4ff] hover:bg-[#3c1848] hover:text-[#ff98cf]" : "text-[#6e6597] hover:bg-[#ffe0e9] hover:text-[#c82d66]"}`}
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {showProjectSelector && onUpdateTask ? (
          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setShowProjects((current) => !current)}
              disabled={fragment}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] transition-colors ${
                currentProject
                  ? "border-transparent"
                  : isDark
                    ? "border-dashed border-[#fff2a8] text-[#ddd4ff] hover:border-[#6ff3d5] hover:text-white"
                    : "border-dashed border-[#21185b] text-[#6e6597] hover:border-[#2347d8] hover:text-[#181457]"
              }`}
              style={
                currentProject
                  ? {
                      backgroundColor: `${currentProject.color}20`,
                      color: currentProject.color,
                    }
                  : undefined
              }
            >
              <Folder size={12} />
              <span>{currentProject ? currentProject.title : "Assign to project"}</span>
            </button>

            {!fragment && showProjects ? (
              <div
                className="retro-panel absolute left-0 top-full z-10 mt-2 min-w-[220px] rounded-[18px] p-2 shadow-lg"
                style={
                  isDark
                    ? {
                        backgroundImage:
                          "linear-gradient(180deg, rgba(28,23,94,0.98), rgba(18,15,53,0.95))",
                      }
                    : undefined
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    onUpdateTask(task.id, { projectId: null });
                    setShowProjects(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${isDark ? "text-[#ddd4ff] hover:bg-white/10" : "text-[#4a4177] hover:bg-white/70"}`}
                >
                  <div className="h-3 w-3 rounded-full border border-slate-300" />
                  <span>No project</span>
                </button>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      onUpdateTask(task.id, { projectId: project.id });
                      setShowProjects(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/70 ${
                      project.id === task.projectId
                        ? isDark
                          ? "bg-[#28306d] text-[#fff2a8]"
                          : "bg-[#dbe3ff] text-[#2347d8]"
                        : isDark
                          ? "text-[#f7f4ff]"
                          : "text-[#181457]"
                    }`}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.title}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : currentProject ? (
          <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.05em] ${isDark ? "border-[#fff2a8]" : "border-[#21185b]"}`}
            style={{
              backgroundColor: `${currentProject.color}15`,
              color: currentProject.color,
            }}
          >
            <Folder size={12} />
            <span>{currentProject.title}</span>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div
      className={`relative rounded-2xl border p-4 shadow-sm transition-all ${
        task.completed
          ? "retro-panel border-[#2d7f57] bg-[linear-gradient(180deg,_rgba(235,255,238,0.96),_rgba(201,249,221,0.92))]"
          : "retro-panel bg-white"
      }`}
      style={
        {
          ...tearSurfaceStyle,
          transform: isTearing ? "rotate(-1.2deg) scale(0.985)" : undefined,
        }
      }
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
          isTearing ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 transition-opacity duration-150"
          style={{ opacity: isTearing ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 rounded-2xl border-2 transition-all duration-300 ease-out"
            style={{
              ...tearSurfaceStyle,
              borderColor: isDark ? "#fff2a8" : "#21185b",
              clipPath:
                "polygon(0 0, 100% 0, 100% 44%, 92% 48%, 84% 42%, 74% 50%, 65% 43%, 54% 51%, 44% 42%, 33% 50%, 23% 44%, 13% 49%, 0 43%)",
              transform: isTearing ? "translate(-14px, -22px) rotate(-6deg)" : "translateY(0)",
              boxShadow: isDark
                ? "0 16px 24px rgba(0,0,0,0.42)"
                : "0 16px 24px rgba(24,20,87,0.18)",
            }}
          >
            <div className="absolute inset-0 px-4 py-4">
              {renderCardContent(true)}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 transition-opacity duration-150"
          style={{ opacity: isTearing ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 rounded-2xl border-2 transition-all duration-300 ease-out"
            style={{
              ...tearSurfaceStyle,
              borderColor: isDark ? "#fff2a8" : "#21185b",
              clipPath:
                "polygon(0 55%, 11% 49%, 22% 57%, 33% 50%, 43% 58%, 54% 49%, 64% 57%, 74% 50%, 83% 57%, 92% 50%, 100% 55%, 100% 100%, 0 100%)",
              transform: isTearing ? "translate(18px, 30px) rotate(7deg)" : "translateY(0)",
              boxShadow: isDark
                ? "0 18px 30px rgba(0,0,0,0.48)"
                : "0 18px 30px rgba(24,20,87,0.2)",
            }}
          >
            <div className="absolute inset-0 px-4 py-4">
              {renderCardContent(true)}
            </div>
          </div>
        </div>
        <div
          className="absolute left-[8%] top-[46%] h-[5px] w-[84%] transition-all duration-300 ease-out"
          style={{
            background:
              "repeating-linear-gradient(102deg, rgba(255,255,255,0.95), rgba(255,255,255,0.95) 9px, rgba(33,24,91,0.78) 9px, rgba(33,24,91,0.78) 14px)",
            transform: isTearing ? "rotate(-6deg) scaleX(1.03)" : "scaleX(0.88)",
            opacity: isTearing ? 1 : 0,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.3), 0 0 14px rgba(255,255,255,0.14)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.18),transparent_24%)]" />
      </div>

      <div className={`transition-all duration-200 ${isTearing ? "scale-[0.98] opacity-0 blur-[1px]" : "opacity-100"}`}>
        {renderCardContent()}
      </div>
    </div>
  );
}
