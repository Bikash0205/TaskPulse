"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskPulseItem, UserRole, TaskStatus } from "@shared/types";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Clock,
  User,
  Plus,
  Trash2,
  FileCheck2,
  Upload,
  Image as ImageIcon,
  Maximize2,
  RotateCcw,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";

interface TaskDetailModalProps {
  task: TaskPulseItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentUserId: string;
  currentUserName?: string;
  onUpdateTask: (task: TaskPulseItem) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  currentRole,
  currentUserId,
  currentUserName = "Project Manager",
  onUpdateTask,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
}) => {
  const [newStepText, setNewStepText] = useState("");
  const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewScreenshot, setReviewScreenshot] = useState<string | null>(null);
  const [changeFeedback, setChangeFeedback] = useState("");
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [viewingImageFullscreen, setViewingImageFullscreen] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const isAssignee = task.assignee?.id === currentUserId;
  const isManagerOrAdmin = currentRole === "admin" || currentRole === "manager" || !currentUserId;
  const canEdit = isManagerOrAdmin || isAssignee;

  // Checklist calculations
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  const handleAddStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    onAddSubtask(task.id, newStepText.trim());
    setNewStepText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForReview = () => {
    const updated: TaskPulseItem = {
      ...task,
      status: "in_review",
      progressPercentage: 100,
      completionNotes: reviewNotes.trim() || "All steps completed. Ready for manager sign-off.",
      completionScreenshot: reviewScreenshot || task.completionScreenshot,
      updatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
    setIsSubmitReviewOpen(false);
    setReviewNotes("");
    setReviewScreenshot(null);
  };

  const handleApproveAndComplete = () => {
    const updated: TaskPulseItem = {
      ...task,
      status: "completed",
      progressPercentage: 100,
      verifiedByManager: true,
      reviewerName: currentUserName,
      verifiedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      updatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
  };

  const handleConfirmRequestChanges = () => {
    if (!changeFeedback.trim()) return;
    const updated: TaskPulseItem = {
      ...task,
      status: "in_progress",
      progressPercentage: 80,
      reviewFeedback: changeFeedback.trim(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
    setIsRequestingChanges(false);
    setChangeFeedback("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      >
        {/* Modal Box */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* TOP HEADER */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {task.projectName && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#756EF3] dark:text-[#818CF8] bg-[#756EF3]/10 dark:bg-[#756EF3]/20 px-2 py-0.5 rounded-md">
                    <FolderGit2 className="w-3.5 h-3.5" />
                    {task.projectName}
                  </span>
                )}
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {task.projectBadge}
                </span>
                {task.category && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {task.category}
                  </span>
                )}
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold ${
                    task.priority === "critical"
                      ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300"
                      : task.priority === "high"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug pt-1">
                {task.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="p-5 overflow-y-auto space-y-5 text-xs">
            {/* 1. STATUS & PROGRESS SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-semibold text-slate-500 uppercase">Workflow Status</label>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    disabled={!canEdit}
                    onChange={(e) => {
                      const next = e.target.value as TaskStatus;
                      onUpdateTask({
                        ...task,
                        status: next,
                        progressPercentage: next === "completed" ? 100 : task.progressPercentage,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#756EF3] cursor-pointer capitalize"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review (Manager Sign-Off)</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-semibold text-slate-500 uppercase">Completion Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{task.progressPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${task.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. ASSIGNEE & TEAM INFO */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {task.assignee?.avatarUrl ? (
                  <img
                    src={task.assignee.avatarUrl}
                    alt={task.assignee.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#756EF3]/15 text-[#756EF3] font-bold flex items-center justify-center text-xs">
                    {task.assignee?.name ? task.assignee.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {task.assignee?.name || "Unassigned"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {task.department} • <span className="capitalize font-mono">{task.assignee?.isInvited ? "Invited Collaborator" : (task.assignee?.role || "Member")}</span>
                  </p>
                  {task.assignee?.invitedEmail && (
                    <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                      {task.assignee.invitedEmail}
                    </p>
                  )}
                </div>
              </div>

              {task.assignee?.isInvited ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-semibold flex items-center gap-1">
                  <span>Invited via Email</span>
                </span>
              ) : task.assignee ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
                  Active Member
                </span>
              ) : null}
            </div>

            {/* 3. MANAGER REVIEW & EVIDENCE WORKFLOW (SIGNATURE MOBILE FEATURE) */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#756EF3]" />
                <span>Verification & Review Protocol</span>
              </h3>

              {/* Verified Badge if approved */}
              {task.verifiedByManager && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start justify-between gap-3 text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs">Verified & Approved by Project Manager</h4>
                      <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80 mt-0.5">
                        Approved by <strong>{task.reviewerName || "Sarah Chen"}</strong> {task.verifiedAt ? `on ${task.verifiedAt}` : ""}.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold uppercase">
                    Sign-Off Complete
                  </span>
                </div>
              )}

              {/* Review Feedback if changes were requested */}
              {task.reviewFeedback && task.status === "in_progress" && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Project Manager Feedback (Revisions Needed)</span>
                  </div>
                  <p className="text-[11px] pl-5.5 leading-relaxed">{task.reviewFeedback}</p>
                </div>
              )}

              {/* Submitted Review Box (In Review status) */}
              {task.status === "in_review" && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-bold text-amber-800 dark:text-amber-300 text-xs">
                        Submitted for Project Manager Review
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">Awaiting Approval</span>
                  </div>

                  {/* Assignee Notes */}
                  {task.completionNotes && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        Assignee Completion Notes:
                      </span>
                      <p className="italic text-slate-700 dark:text-slate-300">{task.completionNotes}</p>
                    </div>
                  )}

                  {/* Attached Screenshot Evidence */}
                  {task.completionScreenshot && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        Attached Verification Proof:
                      </span>
                      <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-sm">
                        <img
                          src={task.completionScreenshot}
                          alt="Verification proof"
                          className="w-full h-36 object-cover cursor-pointer group-hover:scale-105 transition-transform"
                          onClick={() => setViewingImageFullscreen(task.completionScreenshot || null)}
                        />
                        <button
                          onClick={() => setViewingImageFullscreen(task.completionScreenshot || null)}
                          className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>View Full Image</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manager Action Buttons */}
                  {isManagerOrAdmin && (
                    <div className="pt-2 border-t border-amber-500/20 space-y-2">
                      {!isRequestingChanges ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleApproveAndComplete}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Complete Task</span>
                          </button>
                          <button
                            onClick={() => setIsRequestingChanges(true)}
                            className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Request Changes
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-300">
                          <label className="font-semibold text-xs text-amber-800 dark:text-amber-300">
                            Explain Required Changes:
                          </label>
                          <textarea
                            rows={2}
                            value={changeFeedback}
                            onChange={(e) => setChangeFeedback(e.target.value)}
                            placeholder="e.g. Please add automated regression tests for the JWT validation middleware."
                            className="w-full p-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#756EF3]"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setIsRequestingChanges(false)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleConfirmRequestChanges}
                              className="px-3 py-1 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-500 cursor-pointer"
                            >
                              Send Change Request
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit for Review Button (if in progress or backlog) */}
              {task.status !== "in_review" && task.status !== "completed" && (
                <div>
                  {!isSubmitReviewOpen ? (
                    <button
                      onClick={() => setIsSubmitReviewOpen(true)}
                      className="w-full py-2 px-3 rounded-xl border border-[#756EF3]/30 bg-[#756EF3]/10 dark:bg-[#756EF3]/15 hover:bg-[#756EF3]/20 text-[#756EF3] dark:text-[#818CF8] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Submit for Manager Review & Sign-Off</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Submit Deliverable for Sign-Off</span>
                        <button
                          onClick={() => setIsSubmitReviewOpen(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-500">COMPLETION NOTES</label>
                        <textarea
                          rows={2}
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Summarize the work done, PR links, or verification steps..."
                          className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-[#756EF3]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-500">ATTACH SCREENSHOT / PROOF</label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Upload className="w-3.5 h-3.5 text-[#756EF3]" />
                            <span>Upload Image File</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                          {reviewScreenshot && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Image Loaded
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => setIsSubmitReviewOpen(false)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitForReview}
                          className="px-4 py-1.5 text-xs font-bold bg-[#756EF3] hover:bg-[#635BFF] text-white rounded-xl cursor-pointer transition-colors shadow-sm"
                        >
                          Submit Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. SUBTASKS & STEP CHECKLIST */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#756EF3]" />
                  <span>Subtask Checklist ({completedSubtasks}/{totalSubtasks})</span>
                </h3>
              </div>

              <div className="space-y-1.5">
                {task.subtasks?.map((step) => (
                  <div
                    key={step.id}
                    onClick={() => canEdit && onToggleSubtask(task.id, step.id)}
                    className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                      step.completed
                        ? "bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className={`leading-relaxed ${step.completed ? "line-through text-slate-400" : ""}`}>
                        {step.title}
                      </span>
                    </div>

                    {canEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSubtask(task.id, step.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Inline Add Step Form */}
              {canEdit && (
                <form onSubmit={handleAddStepSubmit} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    placeholder="Add another step or requirement..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-[#756EF3]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#756EF3] hover:bg-[#635BFF] text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Step</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
              Task ID: {task.id}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX FOR SCREENSHOT VERIFICATION */}
      {viewingImageFullscreen && (
        <div
          onClick={() => setViewingImageFullscreen(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewingImageFullscreen(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={viewingImageFullscreen}
              alt="Full verification screenshot"
              className="max-h-[85vh] w-auto rounded-xl shadow-2xl border border-slate-800 object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
