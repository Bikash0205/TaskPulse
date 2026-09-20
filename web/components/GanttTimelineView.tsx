"use client";

import React, { useState } from "react";
import { X, Calendar, Flag, CheckCircle, AlertTriangle, Clock, Layers, ArrowRight } from "lucide-react";

export interface Milestone {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  targetDate: string;
  status: "upcoming" | "reached" | "delayed";
  description?: string;
}

export interface RoadmapItem {
  id: string;
  projectId: string;
  projectName: string;
  code: string;
  department: string;
  startWeek: number;
  durationWeeks: number;
  progressPercentage: number;
  status: "on_track" | "at_risk" | "delayed" | "completed";
  leadName: string;
  leadRole: string;
  leadAvatar?: string;
  dependencies?: string[];
  milestones?: Milestone[];
}

export const mockMilestones: Milestone[] = [
  {
    id: "ms-1",
    title: "Sprint 14 Release Gate",
    projectId: "proj-web",
    projectName: "Website Building",
    targetDate: "Sep 28",
    status: "reached",
    description: "All backend auth migrations and frontend mock layouts approved.",
  },
  {
    id: "ms-2",
    title: "SOC 2 Type II Audit Checkpoint",
    projectId: "p4",
    projectName: "Cubbles Engine",
    targetDate: "Oct 12",
    status: "upcoming",
    description: "External auditor inspection of role-based permissions and access logs.",
  },
  {
    id: "ms-3",
    title: "Executive Board Showcase",
    projectId: "p5",
    projectName: "Ui8 Platform",
    targetDate: "Oct 24",
    status: "upcoming",
    description: "Q3 portfolio presentation to leadership with live velocity KPIs.",
  },
  {
    id: "ms-4",
    title: "Q4 Public GA Launch",
    projectId: "proj-mktg",
    projectName: "Digital Marketing",
    targetDate: "Nov 15",
    status: "upcoming",
    description: "Multichannel marketing campaign and global customer onboarding.",
  },
];

export const mockRoadmapItems: RoadmapItem[] = [
  {
    id: "rm-1",
    projectId: "proj-web",
    projectName: "Website Building",
    code: "WEB",
    department: "Engineering",
    startWeek: 1,
    durationWeeks: 4,
    progressPercentage: 75,
    status: "on_track",
    leadName: "Sarah Chen",
    leadRole: "Engineering Lead",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Core Auth", "Database Sharding"],
    milestones: [mockMilestones[0]],
  },
  {
    id: "rm-2",
    projectId: "p1",
    projectName: "Application Design",
    code: "APP",
    department: "Design",
    startWeek: 2,
    durationWeeks: 3,
    progressPercentage: 62,
    status: "on_track",
    leadName: "David Kim",
    leadRole: "Staff Product Designer",
    leadAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Design Tokens v2"],
  },
  {
    id: "rm-3",
    projectId: "p4",
    projectName: "Cubbles Engine",
    code: "ENG",
    department: "Engineering",
    startWeek: 2,
    durationWeeks: 5,
    progressPercentage: 80,
    status: "on_track",
    leadName: "Marcus Vance",
    leadRole: "Principal Systems Architect",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    dependencies: ["WebSocket Cluster"],
    milestones: [mockMilestones[1]],
  },
  {
    id: "rm-4",
    projectId: "p2",
    projectName: "Unity Dashboard",
    code: "UNT",
    department: "Engineering",
    startWeek: 4,
    durationWeeks: 3,
    progressPercentage: 50,
    status: "at_risk",
    leadName: "Elena Rostova",
    leadRole: "Senior Frontend Engineer",
    leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Telemetry Aggregator"],
  },
  {
    id: "rm-5",
    projectId: "p5",
    projectName: "Ui8 Platform",
    code: "PRD",
    department: "Product",
    startWeek: 3,
    durationWeeks: 4,
    progressPercentage: 90,
    status: "on_track",
    leadName: "Marcus Lee",
    leadRole: "Product Director",
    leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Enterprise SLA Tier"],
    milestones: [mockMilestones[2]],
  },
  {
    id: "rm-6",
    projectId: "proj-mktg",
    projectName: "Digital Marketing",
    code: "MKTG",
    department: "Marketing",
    startWeek: 5,
    durationWeeks: 3,
    progressPercentage: 40,
    status: "on_track",
    leadName: "Aria Thorne",
    leadRole: "VP Marketing",
    leadAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    dependencies: ["Creator Endorsements"],
    milestones: [mockMilestones[3]],
  },
];

const WEEKS = [
  { num: 38, label: "W38", date: "Sep 15" },
  { num: 39, label: "W39", date: "Sep 22", isCurrent: true },
  { num: 40, label: "W40", date: "Sep 29" },
  { num: 41, label: "W41", date: "Oct 06" },
  { num: 42, label: "W42", date: "Oct 13" },
  { num: 43, label: "W43", date: "Oct 20" },
  { num: 44, label: "W44", date: "Oct 27" },
  { num: 45, label: "W45", date: "Nov 03" },
];

const DEPARTMENTS = ["All", "Engineering", "Design", "Product", "Marketing"];

interface GanttTimelineViewProps {
  onSelectProject?: (projectId: string) => void;
  isDarkMode?: boolean;
}

export const GanttTimelineView: React.FC<GanttTimelineViewProps> = ({
  onSelectProject,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedRoadmapItem, setSelectedRoadmapItem] = useState<RoadmapItem | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const filteredItems = mockRoadmapItems.filter(
    (item) => selectedDepartment === "All" || item.department === selectedDepartment
  );

  const totalInitiatives = mockRoadmapItems.length;
  const onTrackCount = mockRoadmapItems.filter((i) => i.status === "on_track" || i.status === "completed").length;
  const atRiskCount = mockRoadmapItems.filter((i) => i.status === "at_risk" || i.status === "delayed").length;
  const milestoneCount = mockMilestones.length;

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none">
      {/* Executive Portfolio Health Rollup */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3.5 bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-2xl shadow-xs">
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFF] dark:bg-[#0B0F19]">
          <span className="text-xl font-black text-[#756EF3]">{totalInitiatives}</span>
          <span className="text-[10px] font-bold text-[#848A94] uppercase tracking-wider mt-0.5">Initiatives</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFF] dark:bg-[#0B0F19]">
          <span className="text-xl font-black text-[#10B981]">{onTrackCount}</span>
          <span className="text-[10px] font-bold text-[#848A94] uppercase tracking-wider mt-0.5">On Schedule</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFF] dark:bg-[#0B0F19]">
          <span className="text-xl font-black text-[#F59E0B]">{atRiskCount}</span>
          <span className="text-[10px] font-bold text-[#848A94] uppercase tracking-wider mt-0.5">At Risk</span>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFF] dark:bg-[#0B0F19]">
          <span className="text-xl font-black text-[#6366F1]">{milestoneCount}</span>
          <span className="text-[10px] font-bold text-[#848A94] uppercase tracking-wider mt-0.5">Milestones</span>
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {DEPARTMENTS.map((dept) => {
          const isActive = selectedDepartment === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#756EF3] text-white shadow-xs"
                  : "bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] text-[#848A94] hover:text-[#002055] dark:hover:text-[#F8FAFC]"
              }`}
            >
              {dept === "All" ? "All Departments" : dept}
            </button>
          );
        })}
      </div>

      {/* Key Milestone Strip */}
      <div className="p-3 bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-2xl">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Flag className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#002055] dark:text-[#F8FAFC]">
            Key Milestones & Gates
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {mockMilestones.map((ms) => (
            <button
              key={ms.id}
              onClick={() => setSelectedMilestone(ms)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E9F1FF] dark:border-[#1E293B] bg-[#F8FAFF] dark:bg-[#0B0F19] hover:border-[#756EF3]/40 transition-colors cursor-pointer shrink-0"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  ms.status === "reached"
                    ? "bg-[#10B981]"
                    : ms.status === "delayed"
                    ? "bg-[#EF4444]"
                    : "bg-[#F59E0B]"
                }`}
              />
              <span className="text-xs font-semibold text-[#002055] dark:text-[#F8FAFC]">
                {ms.targetDate}: {ms.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Timeline Chart Grid */}
      <div className="w-full bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            {/* Timescale Ruler Header */}
            <div className="flex border-b border-[#E9F1FF] dark:border-[#1E293B] bg-[#F8FAFF] dark:bg-[#0B0F19]">
              <div className="w-48 shrink-0 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-[#848A94] border-r border-[#E9F1FF] dark:border-[#1E293B]">
                Initiative / Lead
              </div>
              <div className="flex-1 grid grid-cols-8">
                {WEEKS.map((w) => (
                  <div
                    key={w.num}
                    className={`text-center py-2.5 px-1 border-r border-[#E9F1FF]/60 dark:border-[#1E293B]/60 last:border-r-0 ${
                      w.isCurrent ? "bg-[#756EF3]/10 dark:bg-[#756EF3]/15 font-bold" : ""
                    }`}
                  >
                    <div className="text-xs font-black text-[#002055] dark:text-[#F8FAFC]">{w.label}</div>
                    <div className="text-[10px] text-[#848A94]">{w.date}</div>
                    {w.isCurrent && (
                      <span className="inline-block px-1 py-0.2 rounded bg-[#756EF3] text-white text-[8px] font-bold mt-0.5">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Workstream Lanes */}
            <div className="divide-y divide-[#E9F1FF] dark:divide-[#1E293B]">
              {filteredItems.map((item) => {
                const colWidthPercent = 100 / 8;
                const leftPercent = (item.startWeek - 1) * colWidthPercent;
                const barWidthPercent = item.durationWeeks * colWidthPercent;

                return (
                  <div key={item.id} className="flex items-center hover:bg-[#F8FAFF]/50 dark:hover:bg-[#0B0F19]/50 transition-colors">
                    {/* Left Sticky Project Info */}
                    <div className="w-48 shrink-0 px-4 py-3.5 border-r border-[#E9F1FF] dark:border-[#1E293B] flex items-center gap-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#756EF3]/10 text-[#756EF3] text-[9px] font-mono font-bold">
                        {item.code}
                      </span>
                      <div className="truncate flex-1">
                        <div className="text-xs font-bold text-[#002055] dark:text-[#F8FAFC] truncate">
                          {item.projectName}
                        </div>
                        <div className="text-[10px] text-[#848A94] truncate">
                          {item.leadName}
                        </div>
                      </div>
                    </div>

                    {/* Right Timeline Canvas */}
                    <div className="flex-1 relative h-16 flex items-center px-1">
                      {/* Grid Column Guidelines */}
                      <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
                        {WEEKS.map((w) => (
                          <div
                            key={w.num}
                            className={`border-r border-[#E9F1FF]/30 dark:border-[#1E293B]/30 last:border-r-0 h-full ${
                              w.isCurrent ? "bg-[#756EF3]/5 dark:bg-[#756EF3]/10" : ""
                            }`}
                          />
                        ))}
                      </div>

                      {/* Interactive Gantt Duration Bar */}
                      <button
                        onClick={() => setSelectedRoadmapItem(item)}
                        style={{
                          left: `${leftPercent}%`,
                          width: `${barWidthPercent}%`,
                        }}
                        className={`absolute h-10 rounded-xl px-2.5 flex items-center justify-between text-left transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer border ${
                          item.status === "at_risk"
                            ? "bg-[#FEF3C7] dark:bg-[#78350F]/40 border-[#F59E0B] text-[#92400E] dark:text-[#FDE68A]"
                            : item.status === "completed"
                            ? "bg-[#D1FAE5] dark:bg-[#064E3B]/40 border-[#10B981] text-[#065F46] dark:text-[#A7F3D0]"
                            : "bg-[#EEF2FF] dark:bg-[#312E81]/40 border-[#756EF3] text-[#3730A3] dark:text-[#C7D2FE]"
                        }`}
                      >
                        <div className="truncate mr-1">
                          <div className="text-[11px] font-bold truncate">{item.projectName}</div>
                          <div className="text-[9px] opacity-75 truncate">{item.department}</div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          <span className="text-[10px] font-black font-mono">{item.progressPercentage}%</span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Initiative Inspector Modal */}
      {selectedRoadmapItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-4 text-[#002055] dark:text-[#F8FAFC]">
            <div className="flex items-center justify-between border-b border-[#E9F1FF] dark:border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-[#756EF3]/15 text-[#756EF3] font-mono text-xs font-bold">
                  {selectedRoadmapItem.code}
                </span>
                <h3 className="font-bold text-base">{selectedRoadmapItem.projectName}</h3>
              </div>
              <button
                onClick={() => setSelectedRoadmapItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[#848A94] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FAFF] dark:bg-[#0B0F19]">
                <span className="text-[#848A94] block">Lead Owner</span>
                <span className="font-bold mt-0.5 block">{selectedRoadmapItem.leadName}</span>
                <span className="text-[10px] text-[#848A94]">{selectedRoadmapItem.leadRole}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFF] dark:bg-[#0B0F19]">
                <span className="text-[#848A94] block">Status</span>
                <span className="font-bold mt-0.5 block capitalize">{selectedRoadmapItem.status.replace("_", " ")}</span>
                <span className="text-[10px] font-mono text-[#756EF3]">{selectedRoadmapItem.progressPercentage}% Completed</span>
              </div>
            </div>

            {selectedRoadmapItem.dependencies && selectedRoadmapItem.dependencies.length > 0 && (
              <div>
                <span className="text-xs font-bold text-[#848A94] uppercase tracking-wider block mb-1.5">
                  Linked Dependencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRoadmapItem.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="px-2.5 py-1 rounded-lg bg-[#F0EFFF] dark:bg-[#756EF3]/15 text-[#756EF3] text-xs font-semibold"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (onSelectProject) onSelectProject(selectedRoadmapItem.projectId);
                setSelectedRoadmapItem(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#756EF3] text-white text-xs font-bold hover:bg-[#5B52E0] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Inspect Project Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Milestone Checkpoint Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-4 text-[#002055] dark:text-[#F8FAFC]">
            <div className="flex items-center justify-between border-b border-[#E9F1FF] dark:border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="font-bold text-base">{selectedMilestone.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[#848A94] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E9F1FF] dark:border-[#1E293B]">
                <span className="text-[#848A94]">Target Date</span>
                <span className="font-bold">{selectedMilestone.targetDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E9F1FF] dark:border-[#1E293B]">
                <span className="text-[#848A94]">Associated Project</span>
                <span className="font-bold">{selectedMilestone.projectName || "Enterprise Workspace"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E9F1FF] dark:border-[#1E293B]">
                <span className="text-[#848A94]">Clearance Status</span>
                <span className="font-bold capitalize">{selectedMilestone.status}</span>
              </div>
              {selectedMilestone.description && (
                <div className="pt-2 text-[#556070] dark:text-[#94A3B8] leading-relaxed">
                  {selectedMilestone.description}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedMilestone(null)}
              className="w-full py-2.5 rounded-xl bg-[#756EF3] text-white text-xs font-bold hover:bg-[#5B52E0] transition-colors cursor-pointer"
            >
              Acknowledge Checkpoint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
