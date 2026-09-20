"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
  Lock,
  CornerDownRight,
  User,
} from "lucide-react";

export interface ThreadedComment {
  id: string;
  author: string;
  role: "Super Admin" | "Tech Lead" | "Compliance Officer" | "Specialist" | "Client Stakeholder";
  text: string;
  time: string;
  isInternalOnly?: boolean;
  replies?: {
    id: string;
    author: string;
    role: "Super Admin" | "Tech Lead" | "Compliance Officer" | "Specialist" | "Client Stakeholder";
    text: string;
    time: string;
    isInternalOnly?: boolean;
  }[];
}

interface EnterpriseThreadedDiscussionProps {
  taskId: string;
  taskTitle: string;
  isDarkMode: boolean;
  currentUserRole?: string;
  currentUserName?: string;
}

export const EnterpriseThreadedDiscussionSection: React.FC<EnterpriseThreadedDiscussionProps> = ({
  taskId,
  taskTitle,
  isDarkMode,
  currentUserRole = "Super Admin",
  currentUserName = "Bikash Kumar Yadav",
}) => {
  // Mode: Full Internal View vs Client/Guest Safe Portal View
  const [isClientPortalMode, setIsClientPortalMode] = useState(false);

  // Replying state
  const [replyTargetCommentId, setReplyTargetCommentId] = useState<string | null>(null);
  const [replyTargetAuthor, setReplyTargetAuthor] = useState<string | null>(null);

  // New comment input
  const [inputText, setInputText] = useState("");
  const [isNoteInternalOnly, setIsNoteInternalOnly] = useState(false);

  // Pre-populated enterprise discussions
  const [threads, setThreads] = useState<ThreadedComment[]>([
    {
      id: "thread-1",
      author: "Bikash Kumar Yadav",
      role: "Super Admin",
      time: "25m ago",
      text: "Formal Governance Gate 1 (Design QA Audit) successfully signed with cryptographic token AUTH-SIG#AA30.",
      isInternalOnly: false,
      replies: [
        {
          id: "rep-1-1",
          author: "Elena Rostova",
          role: "Tech Lead",
          time: "18m ago",
          text: "Verified responsive touch boundaries and zero layout shifts on physical device. Test pass rate is 100%.",
          isInternalOnly: true,
        },
        {
          id: "rep-1-2",
          author: "Marcus Vance",
          role: "Specialist",
          time: "12m ago",
          text: "Customer sign-off milestone is staged. Preparing executive briefing for quarterly steering committee.",
          isInternalOnly: false,
        },
      ],
    },
    {
      id: "thread-2",
      author: "David Kim (Acme Partner)",
      role: "Client Stakeholder",
      time: "8m ago",
      text: "Reviewed the latest release milestone. The responsive navigation and offline telemetry sync meet enterprise requirements.",
      isInternalOnly: false,
      replies: [
        {
          id: "rep-2-1",
          author: "Bikash Kumar Yadav",
          role: "Super Admin",
          time: "4m ago",
          text: "Thank you David. The signed board brief and SOC 2 audit ledger have been compiled and attached.",
          isInternalOnly: false,
        },
      ],
    },
  ]);

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
      case "Tech Lead":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "Compliance Officer":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Client Stakeholder":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    }
  };

  const handlePost = () => {
    if (!inputText.trim()) return;

    const newEntry = {
      id: "entry-" + Date.now(),
      author: currentUserName,
      role: "Super Admin" as const,
      text: inputText.trim(),
      time: "Just now",
      isInternalOnly: isNoteInternalOnly,
    };

    if (replyTargetCommentId) {
      setThreads((prev) =>
        prev.map((th) => {
          if (th.id === replyTargetCommentId) {
            return {
              ...th,
              replies: [...(th.replies || []), newEntry],
            };
          }
          return th;
        })
      );
      setReplyTargetCommentId(null);
      setReplyTargetAuthor(null);
    } else {
      setThreads((prev) => [
        ...prev,
        {
          ...newEntry,
          replies: [],
        },
      ]);
    }

    setInputText("");
    setIsNoteInternalOnly(false);
  };

  const visibleThreads = threads.map((th) => {
    if (!isClientPortalMode) return th;
    return {
      ...th,
      replies: (th.replies || []).filter((r) => !r.isInternalOnly),
    };
  });

  const totalNotesCount = threads.reduce((acc, t) => acc + 1 + (t.replies?.length || 0), 0);

  return (
    <div className="space-y-3 mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">
            Threaded Discussions & Portal
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
          }`}
        >
          {totalNotesCount} Notes
        </span>
      </div>

      {/* Client / Guest Portal Safe Mode Strip */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
          isDarkMode ? "bg-[#162032] border-[#253554]" : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="pr-3">
          <div className="flex items-center gap-1.5">
            {isClientPortalMode ? (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-bold">
              {isClientPortalMode ? "Client / Guest Portal View" : "Internal Enterprise View"}
            </span>
          </div>
          <p className={`text-[11px] mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            {isClientPortalMode
              ? "Sanitized: Internal engineering notes and sensitive logs hidden."
              : "Unrestricted: All engineering and executive notes visible."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsClientPortalMode(!isClientPortalMode)}
          className={`w-11 h-6 flex items-center rounded-full p-1 shrink-0 transition-colors ${
            isClientPortalMode ? "bg-amber-500" : isDarkMode ? "bg-slate-700" : "bg-slate-300"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isClientPortalMode ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Client Portal Mode Alert Banner */}
      {isClientPortalMode && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Client Portal Safe Mode Active: External stakeholders only receive sanitized progress notes.</span>
        </div>
      )}

      {/* Thread Stream */}
      <div className="space-y-3">
        {visibleThreads.map((thread) => (
          <div
            key={thread.id}
            className={`p-3.5 rounded-2xl border transition-all ${
              thread.isInternalOnly
                ? "border-amber-500/40 bg-amber-500/5"
                : isDarkMode
                ? "bg-[#162032] border-[#253554]"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            {/* Author and Role row */}
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold">{thread.author}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getRoleBadgeClasses(
                    thread.role
                  )}`}
                >
                  {thread.role}
                </span>
                {thread.isInternalOnly && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Internal Only
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                {thread.time}
              </span>
            </div>

            {/* Comment Body */}
            <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
              {thread.text}
            </p>

            {/* Reply action trigger */}
            <div className="mt-2.5 flex items-center justify-between">
              <button
                onClick={() => {
                  setReplyTargetCommentId(thread.id);
                  setReplyTargetAuthor(thread.author);
                }}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <CornerDownRight className="w-3 h-3" />
                <span>Reply to thread</span>
              </button>
            </div>

            {/* Nested replies */}
            {thread.replies && thread.replies.length > 0 && (
              <div className="mt-3 pl-3 space-y-2 border-l-2 border-indigo-500/20">
                {thread.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      reply.isInternalOnly
                        ? "border-amber-500/30 bg-amber-500/5"
                        : isDarkMode
                        ? "bg-[#1D2B44] border-[#253554]"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold">{reply.author}</span>
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${getRoleBadgeClasses(
                            reply.role
                          )}`}
                        >
                          {reply.role}
                        </span>
                        {reply.isInternalOnly && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                            Internal
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {reply.time}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Composer Section */}
      <div
        className={`p-3 rounded-2xl border space-y-2 ${
          isDarkMode ? "bg-[#162032] border-[#253554]" : "bg-slate-50 border-slate-200"
        }`}
      >
        {/* If replying to specific author */}
        {replyTargetAuthor && (
          <div
            className={`px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-medium ${
              isDarkMode ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5" />
              <span>Replying to {replyTargetAuthor}</span>
            </div>
            <button
              onClick={() => {
                setReplyTargetCommentId(null);
                setReplyTargetAuthor(null);
              }}
              className="p-1 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            replyTargetAuthor
              ? `Write reply to ${replyTargetAuthor}...`
              : "Add discussion note, milestone feedback, or review comments..."
          }
          className={`w-full text-xs p-2.5 rounded-xl border outline-none resize-none transition-colors ${
            isDarkMode
              ? "bg-[#0B101D] border-[#253554] text-slate-100 placeholder-slate-500 focus:border-indigo-500"
              : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
          }`}
        />

        {/* Composer Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Internal Only Toggle Button */}
          <button
            type="button"
            onClick={() => setIsNoteInternalOnly(!isNoteInternalOnly)}
            className={`py-1 px-2 rounded-lg border text-[10px] font-semibold flex items-center gap-1 transition-all ${
              isNoteInternalOnly
                ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                : isDarkMode
                ? "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-300"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-700"
            }`}
          >
            <Lock className="w-2.5 h-2.5" />
            <span>{isNoteInternalOnly ? "Internal Only (Masked)" : "Public / Client Visible"}</span>
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={handlePost}
            className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
