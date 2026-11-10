"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppUser } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { Users, Eye, EyeOff, Radio, Sparkles, X } from "lucide-react";

export interface RemoteCursor {
  id: string;
  name: string;
  role: string;
  color: string;
  x: number;
  y: number;
  lastActive: number;
  activeCardTitle?: string;
  isSimulated?: boolean;
}

const PEER_COLORS: Record<string, string> = {
  admin: "#8B5CF6", // Purple
  manager: "#3B82F6", // Blue
  member: "#10B981", // Emerald
  design: "#F59E0B", // Amber
};

interface LiveMultiplayerPresenceCanvasProps {
  currentUser: AppUser | null;
  orgId?: string | null;
}

export const LiveMultiplayerPresenceCanvas: React.FC<LiveMultiplayerPresenceCanvasProps> = ({
  currentUser,
  orgId,
}) => {
  const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
  const [cursorsVisible, setCursorsVisible] = useState(true);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [recentClick, setRecentClick] = useState<{ x: number; y: number; color: string; id: number } | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastEmitRef = useRef<number>(0);
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentUserId = currentUser?.uid || "guest-session";
  const currentUserName = currentUser?.displayName || "You";
  const currentUserRole = currentUser?.role || "member";
  const userColor = PEER_COLORS[currentUserRole] || "#5D55D6";
  const activeOrgScope = orgId || currentUser?.orgId || "default";

  // 1. Setup Local Broadcast Channel & Firestore Presence (Real peers only, scoped by organization)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(`taskpulse_presence_${activeOrgScope}`);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || data.id === currentUserId) return;

        if (data.type === "cursor_move") {
          setRemoteCursors((prev) => ({
            ...prev,
            [data.id]: {
              id: data.id,
              name: data.name,
              role: data.role,
              color: data.color,
              x: data.x,
              y: data.y,
              lastActive: Date.now(),
              activeCardTitle: data.activeCardTitle,
            },
          }));
        } else if (data.type === "cursor_click") {
          setRecentClick({
            x: data.x,
            y: data.y,
            color: data.color,
            id: Date.now(),
          });
        } else if (data.type === "leave") {
          setRemoteCursors((prev) => {
            const next = { ...prev };
            delete next[data.id];
            return next;
          });
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment:", e);
    }

    // Firestore Live Cloud Sync (filtered by activeOrgScope)
    let unsubscribeFirestore = () => {};
    if (db && currentUser) {
      try {
        const presenceCol = collection(db, "presence");
        unsubscribeFirestore = onSnapshot(
          presenceCol,
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              const data = change.doc.data();
              if (change.doc.id === currentUserId) return;
              if (data.orgId && data.orgId !== activeOrgScope) return;
              if (!data.orgId && activeOrgScope !== "org-core") return;

              if (change.type === "added" || change.type === "modified") {
                setRemoteCursors((prev) => ({
                  ...prev,
                  [change.doc.id]: {
                    id: change.doc.id,
                    name: data.name || "Colleague",
                    role: data.role || "member",
                    color: data.color || "#3B82F6",
                    x: data.x || 0,
                    y: data.y || 0,
                    lastActive: Date.now(),
                    activeCardTitle: data.activeCardTitle,
                  },
                }));
              } else if (change.type === "removed") {
                setRemoteCursors((prev) => {
                  const next = { ...prev };
                  delete next[change.doc.id];
                  return next;
                });
              }
            });
          },
          (err) => console.warn("Firestore presence notice:", err)
        );
      } catch (err) {
        console.warn("Firestore presence subscription failed:", err);
      }
    }

    // Cleanup presence on tab close or unmount
    const handleUnload = () => {
      if (channel) {
        channel.postMessage({ type: "leave", id: currentUserId });
      }
      if (db) {
        try {
          deleteDoc(doc(db, "presence", currentUserId)).catch(() => {});
        } catch (e) {}
      }
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      handleUnload();
      if (channel) channel.close();
      unsubscribeFirestore();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [currentUserId, currentUserRole, activeOrgScope, currentUser]);

  // 2. Track & Emit Mouse Movements
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      currentPosRef.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      if (now - lastEmitRef.current < 40) return;
      lastEmitRef.current = now;

      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "cursor_move",
          id: currentUserId,
          name: currentUserName,
          role: currentUserRole,
          color: userColor,
          x: e.clientX,
          y: e.clientY,
        });
      }

      if (db && now % 2000 < 60 && currentUser) {
        setDoc(
          doc(db, "presence", currentUserId),
          {
            name: currentUserName,
            role: currentUserRole,
            color: userColor,
            orgId: activeOrgScope,
            x: e.clientX,
            y: e.clientY,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        ).catch(() => {});
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "cursor_click",
          id: currentUserId,
          color: userColor,
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [currentUserId, currentUserName, currentUserRole, userColor, activeOrgScope, currentUser]);

  // Clean stale cursors older than 6 seconds
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const threshold = Date.now() - 6000;
      setRemoteCursors((prev) => {
        let changed = false;
        const next: Record<string, RemoteCursor> = {};
        for (const [id, cursor] of Object.entries(prev)) {
          if (cursor.lastActive > threshold) {
            next[id] = cursor;
          } else {
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 3000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const peerList = Object.values(remoteCursors);
  const onlineCount = peerList.length + 1;

  return (
    <>
      {/* 1. Live Presence HUD Floating Badge (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowRosterModal(!showRosterModal)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#FAF8F4]/95 dark:bg-[#111726]/95 border border-[#DDD8CE] dark:border-white/10 shadow-lg backdrop-blur-md text-xs font-semibold text-[#1E222D] dark:text-white hover:border-[#5D55D6] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to view active workspace roster"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#5D55D6] dark:text-[#818CF8]" />
            <span>Live Presence</span>
            <span className="px-2 py-0.5 rounded-full bg-[#5D55D6]/12 text-[#5D55D6] dark:text-[#818CF8] font-bold font-mono text-[10px]">
              {onlineCount} Online
            </span>
          </div>

          <div className="flex -space-x-1.5 overflow-hidden ml-1">
            <div
              className="w-5 h-5 rounded-full border-2 border-[#FAF8F4] dark:border-[#111726] flex items-center justify-center text-[9px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: userColor }}
              title={`You (${currentUserName})`}
            >
              {currentUserName.slice(0, 1)}
            </div>
            {peerList.slice(0, 3).map((peer) => (
              <div
                key={peer.id}
                className="w-5 h-5 rounded-full border-2 border-[#FAF8F4] dark:border-[#111726] flex items-center justify-center text-[9px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: peer.color }}
                title={`${peer.name} (${peer.role})`}
              >
                {peer.name.slice(0, 1)}
              </div>
            ))}
          </div>
        </button>

        {peerList.length > 0 && (
          <button
            onClick={() => setCursorsVisible(!cursorsVisible)}
            className="p-2 rounded-xl bg-[#FAF8F4]/95 dark:bg-[#111726]/95 border border-[#DDD8CE] dark:border-white/10 shadow-md text-[#1E222D] dark:text-white hover:bg-[#ECE8DF] dark:hover:bg-slate-800 transition-all cursor-pointer"
            title={cursorsVisible ? "Hide Live Peer Cursors" : "Show Live Peer Cursors"}
          >
            {cursorsVisible ? <Eye className="w-4 h-4 text-[#5D55D6]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>
        )}
      </div>

      {/* 2. Active Workspace Roster Modal */}
      {showRosterModal && (
        <div className="fixed bottom-16 right-4 z-50 w-80 p-4 rounded-3xl bg-[#FAF8F4] dark:bg-[#111726] border border-[#DDD8CE] dark:border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8] dark:border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5D55D6]" />
              <h4 className="text-xs font-bold text-[#1E222D] dark:text-white">Active Workspace Roster</h4>
            </div>
            <button
              onClick={() => setShowRosterModal(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {/* Current User Row */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F2ED] dark:bg-white/5 border border-[#E6E2D8] dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: userColor }} />
                <div>
                  <div className="text-xs font-bold text-[#1E222D] dark:text-white">
                    {currentUserName} <span className="text-[10px] text-slate-500 font-normal">(You)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUserRole}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Online
              </span>
            </div>

            {peerList.length === 0 ? (
              <div className="p-3 rounded-xl border border-dashed border-[#DDD8CE] dark:border-white/10 text-center text-[11px] text-[#5A6070] dark:text-slate-400">
                No other teammates are currently viewing this workspace.
              </div>
            ) : (
              peerList.map((peer) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#F4F2ED] dark:bg-slate-900/60 border border-[#E6E2D8] dark:border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: peer.color }} />
                    <div>
                      <div className="text-xs font-bold text-[#1E222D] dark:text-white">{peer.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                        {peer.activeCardTitle || `${peer.role.toUpperCase()} • Live viewing`}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-semibold">
                    Live Peer
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Render Floating Multiplayer Cursors Layer (Only real connected peers) */}
      {cursorsVisible && peerList.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {recentClick && (
            <div
              key={recentClick.id}
              className="absolute w-8 h-8 rounded-full border-2 animate-ping"
              style={{
                left: recentClick.x - 16,
                top: recentClick.y - 16,
                borderColor: recentClick.color,
              }}
            />
          )}

          {peerList.map((peer) => (
            <div
              key={peer.id}
              className="absolute transition-transform duration-75 ease-out select-none"
              style={{
                transform: `translate3d(${peer.x}px, ${peer.y}px, 0)`,
              }}
            >
              <svg
                className="w-5 h-5 drop-shadow-md"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                  fill={peer.color}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </svg>

              <div
                className="ml-4 -mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-lg whitespace-nowrap flex items-center gap-1.5"
                style={{ backgroundColor: peer.color }}
              >
                <span>{peer.name}</span>
                {peer.activeCardTitle && (
                  <span className="opacity-80 font-normal text-[10px]">
                    &bull; {peer.activeCardTitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
