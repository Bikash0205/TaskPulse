"use client";

import React from "react";
import { ColleagueProfile } from "@shared/types";
import { Users, Crown } from "lucide-react";

interface WorkloadMatrixProps {
  colleagues: ColleagueProfile[];
  onSelectColleague?: (colleague: ColleagueProfile) => void;
}

export const WorkloadMatrix: React.FC<WorkloadMatrixProps> = ({
  colleagues,
  onSelectColleague,
}) => {
  return (
    <section className="p-4 rounded-2xl bg-white dark:bg-[#151C2C] border border-[#E9F1FF] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-[#E9F1FF] dark:border-[#1E293B]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#756EF3] dark:text-[#818CF8]" />
          <h3 className="text-xs font-bold tracking-wider text-[#002055] dark:text-[#F8FAFC] uppercase font-sans">
            Team Workload & Capacity
          </h3>
        </div>

        {/* Capacity Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-sans">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> &le; 3 Optimal
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 4-5 Moderate
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500" /> &gt; 5 Overload
          </span>
        </div>
      </div>

      {colleagues.length === 0 ? (
        <div className="py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 font-sans">
          No active workload telemetry. Add tasks and assign team members to track live capacity.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {colleagues.map((colleague) => {
          const isOverload = colleague.activeTaskCount > 5;
          const isWarning = colleague.activeTaskCount >= 4 && colleague.activeTaskCount <= 5;
          const statusColor = isOverload ? "#EF4444" : isWarning ? "#F59E0B" : "#10B981";
          const ratio = Math.min(100, (colleague.activeTaskCount / colleague.maxBandwidth) * 100);

          return (
            <div
              key={colleague.id}
              onClick={() => onSelectColleague?.(colleague)}
              className="p-3 rounded-xl bg-[#F8FAFF] dark:bg-[#111726] border border-[#E9F1FF] dark:border-[#1E293B] hover:border-[#756EF3]/50 dark:hover:border-[#756EF3]/50 cursor-pointer flex flex-col gap-2 transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {colleague.avatarUrl ? (
                    <img
                      src={colleague.avatarUrl}
                      alt={colleague.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-800 dark:text-white">
                      {colleague.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-200 leading-tight flex items-center gap-1">
                      <span>{colleague.name}</span>
                      {colleague.role === "admin" && (
                        <span title="Admin">
                          <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{colleague.department}</span>
                      <span>&bull;</span>
                      <span
                        className={`capitalize font-semibold ${
                          colleague.role === "admin"
                            ? "text-purple-600 dark:text-purple-400"
                            : colleague.role === "manager"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {colleague.role}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded border"
                  style={{
                    color: statusColor,
                    backgroundColor: `${statusColor}14`,
                    borderColor: `${statusColor}40`,
                  }}
                >
                  {colleague.activeTaskCount} Tasks
                </span>
              </div>

              {/* Bandwidth Progress Track */}
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${ratio}%`,
                    backgroundColor: statusColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};

export default WorkloadMatrix;
