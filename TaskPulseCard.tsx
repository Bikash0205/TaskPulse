"use client";

import React, { useMemo } from "react";
import { motion, PanInfo } from "framer-motion";
import { TaskPulseTokens } from "./taskpulse.tokens";

export type TaskStatus = "backlog" | "in_progress" | "in_review" | "completed" | "blocked";
export type CapacityLevel = "normal" | "warning" | "overload";

export interface ColleagueProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  activeTaskCount: number;
  department: string;
}

export interface TaskPulseItem {
  id: string;
  title: string;
  department: string;
  projectBadge: string;
  status: TaskStatus;
  progressPercentage: number; // 0 to 100
  assignee?: ColleagueProfile;
  priority: "low" | "medium" | "high" | "critical";
  isBlocked?: boolean;
}

interface TaskPulseCardProps {
  task: TaskPulseItem;
  isDraggable?: boolean;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onSelect?: (task: TaskPulseItem) => void;
  onProgressChange?: (taskId: string, newProgress: number) => void;
}

export const TaskPulseCard: React.FC<TaskPulseCardProps> = ({
  task,
  isDraggable = true,
  onDragEnd,
  onSelect,
  onProgressChange,
}) => {
  // Determine capacity state dynamically
  const capacityState: CapacityLevel = useMemo(() => {
    if (task.isBlocked || task.status === "blocked") return "overload";
    if (!task.assignee) return "normal";
    if (task.assignee.activeTaskCount > 4) return "warning";
    return "normal";
  }, [task.isBlocked, task.status, task.assignee]);

  const capacityConfig = useMemo(() => {
    switch (capacityState) {
      case "overload":
        return TaskPulseTokens.colors.capacity.overload;
      case "warning":
        return TaskPulseTokens.colors.capacity.warning;
      case "normal":
      default:
        return TaskPulseTokens.colors.capacity.normal;
    }
  }, [capacityState]);

  return (
    <motion.div
      layoutId={`card-${task.id}`}
      drag={isDraggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 28 }}
      onDragEnd={onDragEnd}
      onClick={() => onSelect?.(task)}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      // 120Hz Hardware Acceleration: Transform & Opacity exclusively on GPU compositor
      whileHover={{
        scale: 1.018,
        y: -3,
        transition: TaskPulseTokens.motion.springFast,
      }}
      whileTap={{
        scale: 0.985,
        transition: TaskPulseTokens.motion.springFast,
      }}
      whileDrag={{
        scale: 1.04,
        zIndex: 50,
        boxShadow: "0 24px 48px 0 rgba(0, 0, 0, 0.65), 0 0 20px " + capacityConfig.glow,
        cursor: "grabbing",
        transition: TaskPulseTokens.motion.springDrag,
      }}
      style={{
        ...TaskPulseTokens.glass.tier3,
        willChange: "transform, opacity",
      }}
      className="relative group p-4 rounded-xl cursor-grab active:cursor-grabbing select-none overflow-hidden transition-colors"
    >
      {/* Dynamic Capacity Aura (GPU-composited opacity layer) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-xl"
        style={{
          boxShadow: `inset 0 0 16px ${capacityConfig.glow}, 0 0 1px ${capacityConfig.border}`,
        }}
      />

      {/* Card Header: Project Badge & Capacity Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/20">
            {task.projectBadge}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            {task.department}
          </span>
        </div>

        {/* Capacity Pulse Pill */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
          style={{
            backgroundColor: capacityConfig.badgeBg,
            border: `1px solid ${capacityConfig.border}`,
            color: capacityConfig.hex,
          }}
        >
          {/* Animated 120Hz Status Dot */}
          <motion.span
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{
              duration: capacityState === "overload" ? 1 : 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: capacityConfig.hex }}
          />
          <span>
            {capacityState === "overload"
              ? "Overloaded"
              : capacityState === "warning"
              ? "High Load"
              : "Optimal"}
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-100 line-clamp-2 mb-3 leading-snug relative z-10">
        {task.title}
      </h4>

      {/* 120Hz Progress Bar: GPU Composited scaleX avoids reflow/repaint */}
      <div className="mb-3 relative z-10">
        <div className="flex items-center justify-between text-[11px] mb-1 font-mono text-slate-400">
          <span>Pulse Completion</span>
          <span className="font-semibold text-slate-200">
            {task.progressPercentage}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-[1px]">
          <motion.div
            className="h-full rounded-full origin-left"
            style={{
              backgroundColor: capacityConfig.hex,
              willChange: "transform",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.max(0, Math.min(100, task.progressPercentage)) / 100 }}
            transition={TaskPulseTokens.motion.springSmooth}
          />
        </div>
      </div>

      {/* Card Footer: Assignee Colleague & Priority */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] relative z-10 text-xs">
        {task.assignee ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              {task.assignee.avatarUrl ? (
                <img
                  src={task.assignee.avatarUrl}
                  alt={task.assignee.name}
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white border border-white/20">
                  {task.assignee.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              {/* Teammate Capacity Pip */}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#070A13]"
                style={{ backgroundColor: capacityConfig.hex }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium leading-none">
                {task.assignee.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {task.assignee.activeTaskCount} active tasks
              </span>
            </div>
          </div>
        ) : (
          <span className="text-slate-500 italic text-[11px]">Unassigned</span>
        )}

        {/* Priority Badge */}
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${
            task.priority === "critical"
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : task.priority === "high"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              : "bg-slate-800 text-slate-300 border border-slate-700"
          }`}
        >
          {task.priority}
        </span>
      </div>
    </motion.div>
  );
};

export default TaskPulseCard;
