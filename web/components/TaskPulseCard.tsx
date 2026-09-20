"use client";

import React, { useState, useMemo } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { TaskPulseItem, CapacityLevel, UserRole } from "@shared/types";
import {
  AlertTriangle,
  Flame,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  Plus,
  X,
} from "lucide-react";

interface TaskPulseCardProps {
  task: TaskPulseItem;
  currentRole: UserRole;
  currentUserId: string;
  isDraggable?: boolean;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onSelect?: (task: TaskPulseItem) => void;
  onUpdateProgress?: (taskId: string, newProgress: number) => void;
  onToggleBlocked?: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string, subtaskTitle: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
}

export const TaskPulseCard: React.FC<TaskPulseCardProps> = ({
  task,
  currentRole,
  currentUserId,
  isDraggable = true,
  onDragEnd,
  onSelect,
  onUpdateProgress,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
}) => {
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Capacity state calculation
  const capacityState: CapacityLevel = useMemo(() => {
    if (task.isBlocked || task.status === "blocked") return "overload";
    if (!task.assignee) return "normal";
    if (task.assignee.activeTaskCount > 4) return "warning";
    return "normal";
  }, [task.isBlocked, task.status, task.assignee]);

  const statusColor =
    capacityState === "overload"
      ? "#EF4444"
      : capacityState === "warning"
      ? "#F59E0B"
      : "#10B981";

  // Subtask metrics
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  // RBAC permission check
  const isAssignee = task.assignee?.id === currentUserId;
  const canMutate = currentRole === "admin" || currentRole === "manager" || isAssignee || !currentUserId;

  return (
    <motion.div
      layoutId={`card-${task.id}`}
      drag={isDraggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.12}
      onDragEnd={onDragEnd}
      onClick={() => onSelect?.(task)}
      whileHover={{ y: -2 }}
      whileDrag={{ scale: 1.02, zIndex: 40, cursor: "grabbing" }}
      className="p-3.5 rounded-xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing select-none flex flex-col gap-2.5 transition-colors relative"
    >
      {/* Top Meta: Project Tag & Capacity Indicator */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          {task.projectName && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
              <FolderGit2 className="w-3 h-3 text-[#756EF3] dark:text-[#818CF8]" />
              {task.projectName}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 dark:bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] border border-blue-200 dark:border-[#756EF3]/30 font-mono">
              {task.projectBadge}
            </span>
            {task.category && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {task.category}
              </span>
            )}
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {task.department}
            </span>
          </div>
        </div>

        {/* Capacity Indicator Pill */}
        <span
          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 self-start shrink-0"
          style={{
            color: statusColor,
            backgroundColor: `${statusColor}14`,
            borderColor: `${statusColor}33`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
          {capacityState === "overload"
            ? "Overloaded"
            : capacityState === "warning"
            ? "High Load"
            : "Normal"}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 line-clamp-2 leading-relaxed">
        {task.title}
      </h4>

      {/* Review Status or Verified Badge */}
      {task.status === "in_review" && (
        <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-[11px]">Under Review</span>
          </div>
          <span className="text-[10px] font-mono opacity-80">Needs Sign-Off</span>
        </div>
      )}

      {task.verifiedByManager && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold font-mono">
          <span>Sign-Off Verified</span>
        </div>
      )}

      {/* Blocker Alert Banner */}
      {task.isBlocked && (
        <div className="px-2 py-1 rounded bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 flex items-center gap-1.5 text-red-600 dark:text-red-400 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{task.blockReason || "Task is blocked"}</span>
        </div>
      )}

      {/* Progress Track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Progress
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{task.progressPercentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${task.progressPercentage}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
      </div>

      {/* To-Do Checklist / Subtasks Section */}
      <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between text-[11px] py-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsChecklistExpanded(!isChecklistExpanded);
            }}
            className="flex items-center gap-1.5 font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#756EF3] dark:text-[#818CF8]" />
            <span>Subtasks / Steps</span>
            <span className="text-slate-400 dark:text-slate-500">
              ({completedSubtasks}/{totalSubtasks})
            </span>
            {isChecklistExpanded ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>

          {canMutate && !isAddingSubtask && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsChecklistExpanded(true);
                setIsAddingSubtask(true);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#756EF3] dark:text-[#818CF8] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
              title="Add a new subtask or step to this task"
            >
              <Plus className="w-3 h-3" />
              <span>Add Subtask</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {isChecklistExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 pt-1.5 pb-0.5 overflow-hidden"
            >
              {task.subtasks?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canMutate) onToggleSubtask?.(task.id, sub.id);
                  }}
                  className={`group flex items-center justify-between gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    sub.completed
                      ? "text-slate-400 line-through bg-slate-100 dark:bg-slate-900/40"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {sub.completed ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="leading-snug text-[11px] select-text break-words">{sub.title}</span>
                  </div>

                  {canMutate && onDeleteSubtask && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSubtask(task.id, sub.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                      title="Delete subtask"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Inline Subtask Input Form */}
              {isAddingSubtask && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (newSubtaskTitle.trim() && onAddSubtask) {
                      onAddSubtask(task.id, newSubtaskTitle.trim());
                      setNewSubtaskTitle("");
                      setIsAddingSubtask(false);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="pt-1 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    autoFocus
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="New subtask / step title..."
                    className="flex-1 px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#756EF3]"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-xs font-semibold bg-[#756EF3] hover:bg-[#756EF3] text-white rounded transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSubtask(false);
                      setNewSubtaskTitle("");
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: Assignee & Priority */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            {task.assignee.avatarUrl ? (
              <img
                src={task.assignee.avatarUrl}
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-[9px] text-slate-800 dark:text-white">
                {task.assignee.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">
              {task.assignee.name}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">Unassigned</span>
        )}

        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize font-mono ${
            task.priority === "critical"
              ? "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30"
              : task.priority === "high"
              ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {task.priority}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskPulseCard;
