"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  TrendingUp,
  Users,
  ShieldCheck,
  Search,
  CheckCircle,
  Calendar,
  Sparkles,
  RefreshCw,
  Award,
} from "lucide-react";
import { MemberSubscriptionRecord } from "@/app/api/subscriptions/route";

interface AdminSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string | null;
}

export const AdminSubscriptionModal: React.FC<AdminSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
}) => {
  const [subscriptions, setSubscriptions] = useState<MemberSubscriptionRecord[]>([]);
  const [kpis, setKpis] = useState({
    mrr: 0,
    activeCount: 0,
    entCount: 0,
    proCount: 0,
    freeCount: 0,
    totalUsers: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<"all" | "enterprise" | "pro" | "free">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
        if (data.kpis) {
          setKpis(data.kpis);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch subscriptions from API:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSubscriptions();
    }
  }, [isOpen]);

  const handleUpdatePlan = async (userId: string, newPlanId: "free" | "pro" | "enterprise") => {
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_plan",
          userId,
          planId: newPlanId,
        }),
      });
      if (res.ok) {
        showFeedback("Subscription tier updated successfully.");
        fetchSubscriptions();
      }
    } catch (e) {
      console.warn("Error updating plan:", e);
    }
  };

  const handleExtendTrial = async (userId: string, days: number) => {
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "extend_trial",
          userId,
          days,
        }),
      });
      if (res.ok) {
        showFeedback(`Extended workspace trial by +${days} days.`);
        fetchSubscriptions();
      }
    } catch (e) {
      console.warn("Error extending trial:", e);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "cancelled" : "active";
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_status",
          userId,
          status: newStatus,
        }),
      });
      if (res.ok) {
        showFeedback(`Subscription status set to ${newStatus}.`);
        fetchSubscriptions();
      }
    } catch (e) {
      console.warn("Error updating status:", e);
    }
  };

  const showFeedback = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 3500);
  };

  if (!isOpen) return null;

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || sub.planId === filterPlan;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#111827] border border-[#E9F1FF] dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Subscription Governance & Billing</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Central control for enterprise and pro workspace subscriptions (Google Play Billing enabled).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {actionSuccessMsg && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100/40 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
              ${kpis.mrr}
              <span className="text-xs text-slate-400 font-normal"> /mo</span>
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              MRR Run Rate
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Subs</span>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
              {kpis.activeCount}
              <span className="text-xs text-slate-400 font-normal"> / {kpis.totalUsers} users</span>
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium mt-0.5">
              Paying Workspaces
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Tier</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
              {kpis.entCount}
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
              $49 / month
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pro Tier</span>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
              {kpis.proCount}
            </div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              $19 / month
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111827]">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, email, or order ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter:</span>
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
              {(["all", "enterprise", "pro", "free"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterPlan(tier)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    filterPlan === tier
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            <button
              onClick={fetchSubscriptions}
              title="Refresh subscriptions"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Member Subscriptions Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredSubscriptions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No subscription records matching the current query.
            </div>
          ) : (
            filteredSubscriptions.map((sub) => {
              const isCurrentAdmin =
                currentUserEmail &&
                sub.userEmail.toLowerCase() === currentUserEmail.toLowerCase();

              return (
                <div
                  key={sub.userId}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: User & Identity info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm border border-purple-500/20">
                      {sub.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {sub.userName}
                        </span>
                        {isCurrentAdmin && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
                            You
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            sub.status === "active"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                              : sub.status === "trialing"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
                              : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{sub.userEmail}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-400">{sub.orderId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Plan info */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        Current Plan
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                        {sub.planName} (${sub.price}/mo)
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Renews {sub.renewsAt}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={sub.planId}
                      onChange={(e) =>
                        handleUpdatePlan(
                          sub.userId,
                          e.target.value as "free" | "pro" | "enterprise"
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="free">Free ($0/mo)</option>
                      <option value="pro">Pro ($19/mo)</option>
                      <option value="enterprise">Enterprise ($49/mo)</option>
                    </select>

                    <button
                      onClick={() => handleExtendTrial(sub.userId, 30)}
                      title="Add 30 days trial"
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      +30d Trial
                    </button>

                    <button
                      onClick={() => handleToggleStatus(sub.userId, sub.status)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        sub.status === "active"
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                          : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {sub.status === "active" ? "Pause" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Google Play Billing & Subscriptions Sandbox Connected</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
