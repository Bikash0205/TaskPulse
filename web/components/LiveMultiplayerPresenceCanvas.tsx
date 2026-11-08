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
}

export const LiveMultiplayerPresenceCanvas: React.FC<LiveMultiplayerPresenceCanvasProps> = ({
  currentUser,
}) => {
  const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
  const [cursorsVisible, setCursorsVisible] = useState(true);
  const [simulationEnabled, setSimulationEnabled] = useState(true);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [recentClick, setRecentClick] = useState<{ x: number; y: number; color: string; id: number } | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastEmitRef = useRef<number>(0);
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentUserId = currentUser?.uid || "guest-session";
  const currentUserName = currentUser?.displayName || "You";
  const currentUserRole = currentUser?.role || "member";
  const userColor = PEER_COLORS[currentUserRole] || "#756EF3";

  // 1. Setup Local Broadcast Channel & Firestore Presence
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cross-tab Broadcast Channel for zero-latency local testing
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("taskpulse_multiplayer_presence");
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

    // Firestore Live Cloud Sync
    let unsubscribeFirestore = () => {};
    if (db) {
      try {
        const presenceCol = collection(db, "presence");
        unsubscribeFirestore = onSnapshot(
          presenceCol,
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              const data = change.doc.data();
              if (change.doc.id === currentUserId) return;

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
  }, [currentUserId, currentUserRole]);

  // 2. Track & Emit Mouse Movements
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      currentPosRef.current = { x: e.clientX, y: e.clientY };

      const now = Date.now();
      if (now - lastEmitRef.current < 40) return; // Throttle to 25fps updates for performance
      lastEmitRef.current = now;

      // Broadcast locally
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

      // Sync to Cloud Firestore every 2 seconds
      if (db && now % 2000 < 60) {
        setDoc(
          doc(db, "presence", currentUserId),
          {
            name: currentUserName,
            role: currentUserRole,
            color: userColor,
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
  }, [currentUserId, currentUserName, currentUserRole, userColor]);

  // 3. Simulated Realistic Colleague Presence in Sandbox
  useEffect(() => {
    if (!simulationEnabled) return;

    let sarahAngle = 0;
    let marcusAngle = Math.PI;

    const interval = setInterval(() => {
      sarahAngle += 0.035;
      marcusAngle += 0.025;

      const screenW = typeof window !== "undefined" ? window.innerWidth : 1200;
      const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

      // Sarah explores top dispatcher and kanban reviews
      const sarahX = Math.round(screenW * 0.45 + Math.cos(sarahAngle) * (screenW * 0.18));
      const sarahY = Math.round(screenH * 0.35 + Math.sin(sarahAngle * 1.5) * 80);

      // Marcus explores in-progress tasks and sprint metrics
      const marcusX = Math.round(screenW * 0.65 + Math.sin(marcusAngle) * (screenW * 0.15));
      const marcusY = Math.round(screenH * 0.55 + Math.cos(marcusAngle * 1.2) * 90);

      setRemoteCursors((prev) => ({
        ...prev,
        "sim-sarah": {
          id: "sim-sarah",
          name: "Sarah Chen",
          role: "manager",
          color: "#3B82F6",
          x: sarahX,
          y: sarahY,
          lastActive: Date.now(),
          activeCardTitle: "Dispatching Sprint 14",
          isSimulated: true,
        },
        "sim-marcus": {
          id: "sim-marcus",
          name: "Marcus Vance",
          role: "member",
          color: "#10B981",
          x: marcusX,
          y: marcusY,
          lastActive: Date.now(),
          activeCardTitle: "Fluid Gesture Engine",
          isSimulated: true,
        },
      }));
    }, 45);

    return () => clearInterval(interval);
  }, [simulationEnabled]);

  // Clean stale cursors older than 6 seconds
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const threshold = Date.now() - 6000;
      setRemoteCursors((prev) => {
        let changed = false;
        const next: Record<string, RemoteCursor> = {};
        for (const [id, cursor] of Object.entries(prev)) {
          if (cursor.isSimulated || cursor.lastActive > threshold) {
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
  const onlineCount = peerList.length + 1; // Peers + current user

  return (
    <>
      {/* 1. Live Presence HUD Floating Badge (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowRosterModal(!showRosterModal)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-[#111726]/95 border border-slate-300 dark:border-white/10 shadow-xl backdrop-blur-md text-xs font-semibold text-[#0F172A] dark:text-white hover:border-[#756EF3] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to view active war room roster"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping" />
          </div>

          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#756EF3]" />
            <span>Live War Room</span>
            <span className="px-2 py-0.5 rounded-full bg-[#756EF3]/15 text-[#756EF3] dark:text-[#818CF8] font-bold font-mono text-[10px]">
              {onlineCount} Active
            </span>
          </div>

          {/* Mini Stacked Avatars */}
          <div className="flex -space-x-1.5 overflow-hidden ml-1">
            <div
              className="w-5 h-5 rounded-full border-2 border-white dark:border-[#111726] flex items-center justify-center text-[9px] font-bold text-white shadow-2xs"
              style={{ backgroundColor: userColor }}
              title={`You (${currentUserName})`}
            >
              {currentUserName.slice(0, 1)}
            </div>
            {peerList.slice(0, 3).map((peer) => (
              <div
                key={peer.id}
                className="w-5 h-5 rounded-full border-2 border-white dark:border-[#111726] flex items-center justify-center text-[9px] font-bold text-white shadow-2xs"
                style={{ backgroundColor: peer.color }}
                title={`${peer.name} (${peer.role})`}
              >
                {peer.name.slice(0, 1)}
              </div>
            ))}
          </div>
        </button>

        {/* Toggle Cursor Visibility */}
        <button
          onClick={() => setCursorsVisible(!cursorsVisible)}
          className="p-2 rounded-xl bg-white/95 dark:bg-[#111726]/95 border border-slate-300 dark:border-white/10 shadow-lg text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title={cursorsVisible ? "Hide Live Peer Cursors" : "Show Live Peer Cursors"}
        >
          {cursorsVisible ? <Eye className="w-4 h-4 text-[#756EF3]" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* 2. Active War Room Roster Modal */}
      {showRosterModal && (
        <div className="fixed bottom-16 right-4 z-50 w-80 p-4 rounded-3xl bg-white dark:bg-[#111726] border border-slate-300 dark:border-white/10 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#756EF3]" />
              <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">Active Dispatch Deck</h4>
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
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: userColor }} />
                <div>
                  <div className="text-xs font-bold text-[#0F172A] dark:text-white">
                    {currentUserName} <span className="text-[10px] text-slate-400 font-normal">(You)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUserRole}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Online
              </span>
            </div>

            {/* Remote Peers Rows */}
            {peerList.map((peer) => (
              <div
                key={peer.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: peer.color }} />
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] dark:text-white">{peer.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {peer.activeCardTitle || `${peer.role.toUpperCase()} • Live viewing`}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-semibold">
                  {peer.isSimulated ? "Simulated" : "Live Peer"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Sandbox Teammates</span>
            <button
              onClick={() => setSimulationEnabled(!simulationEnabled)}
              className="text-[#756EF3] dark:text-[#818CF8] font-bold hover:underline cursor-pointer"
            >
              {simulationEnabled ? "Pause Simulation" : "Enable Simulation"}
            </button>
          </div>
        </div>
      )}

      {/* 3. Render Floating Multiplayer Cursors Layer */}
      {cursorsVisible && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {/* Click Ripple Effect */}
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

          {/* Render Remote Cursors */}
          {peerList.map((peer) => (
            <div
              key={peer.id}
              className="absolute transition-transform duration-75 ease-out select-none"
              style={{
                transform: `translate3d(${peer.x}px, ${peer.y}px, 0)`,
              }}
            >
              {/* Custom SVG Cursor Arrow */}
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

              {/* Colleague Floating Name & Action Pill */}
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
