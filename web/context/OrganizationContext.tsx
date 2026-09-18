"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization, OrganizationInvite, UserRole, Department, Project } from "@shared/types";
import { useAuth, PERMANENT_ADMIN_EMAIL } from "./AuthContext";

export interface OrganizationContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  invites: OrganizationInvite[];
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  assignedProjectForCurrentLogin: string | null;
  setAssignedProjectForCurrentLogin: (projId: string | null) => void;
  onboardCompany: (
    name: string,
    departments?: Department[] | Department,
    initialProjectName?: string,
    initialProjectCode?: string
  ) => { org: Organization; initialProject: Project };
  joinWithCode: (codeOrOrgId: string) => { success: boolean; message: string; org?: Organization };
  inviteTeammate: (
    email: string,
    name: string,
    role: UserRole,
    department: Department,
    assignedProjectIds: string[]
  ) => OrganizationInvite;
  switchOrganization: (orgId: string) => void;
}

export const DEFAULT_CORE_ORG: Organization = {
  id: "org-core",
  name: "TaskPulse Core Workspace",
  slug: "taskpulse-core",
  adminEmail: PERMANENT_ADMIN_EMAIL,
  createdAt: "2026-09-01T00:00:00.000Z",
  departments: ["Engineering", "Product", "Design", "Marketing", "Security", "Operations"],
  inviteCode: "TASK-CORE-2026",
};

export const DEFAULT_INVITES: OrganizationInvite[] = [
  {
    id: "inv-sarah",
    orgId: "org-core",
    email: "sarah.chen@taskpulse.internal",
    name: "Sarah Chen",
    role: "manager",
    department: "Engineering",
    assignedProjectIds: ["proj-web"],
    invitedBy: PERMANENT_ADMIN_EMAIL,
    invitedAt: "2026-09-01T00:00:00.000Z",
    status: "accepted",
  },
  {
    id: "inv-marcus",
    orgId: "org-core",
    email: "marcus.vance@taskpulse.internal",
    name: "Marcus Vance",
    role: "member",
    department: "Engineering",
    assignedProjectIds: ["proj-web"],
    invitedBy: PERMANENT_ADMIN_EMAIL,
    invitedAt: "2026-09-01T00:00:00.000Z",
    status: "accepted",
  },
  {
    id: "inv-elena",
    orgId: "org-core",
    email: "elena.rostova@taskpulse.internal",
    name: "Elena Rostova",
    role: "member",
    department: "Marketing",
    assignedProjectIds: ["proj-mktg"],
    invitedBy: PERMANENT_ADMIN_EMAIL,
    invitedAt: "2026-09-01T00:00:00.000Z",
    status: "accepted",
  },
  {
    id: "inv-david",
    orgId: "org-core",
    email: "david.kim@taskpulse.internal",
    name: "David Kim",
    role: "member",
    department: "Design",
    assignedProjectIds: ["proj-web", "proj-mktg"],
    invitedBy: PERMANENT_ADMIN_EMAIL,
    invitedAt: "2026-09-01T00:00:00.000Z",
    status: "accepted",
  },
];

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, assignUserRole } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([DEFAULT_CORE_ORG]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(DEFAULT_CORE_ORG);
  const [invites, setInvites] = useState<OrganizationInvite[]>(DEFAULT_INVITES);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [assignedProjectForCurrentLogin, setAssignedProjectForCurrentLogin] = useState<string | null>(null);

  // Load saved organizations and invites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrgs = localStorage.getItem("taskpulse_organizations");
      if (savedOrgs) {
        try {
          const parsed = JSON.parse(savedOrgs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrganizations(parsed);
          }
        } catch (e) {}
      }

      const savedInvites = localStorage.getItem("taskpulse_org_invites");
      if (savedInvites) {
        try {
          const parsed = JSON.parse(savedInvites);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setInvites(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Check login and validate whether user has an invited ID or needs organization onboarding
  useEffect(() => {
    if (!user || !user.email) {
      setIsOnboardingOpen(false);
      return;
    }

    const email = user.email.toLowerCase().trim();
    const isPermAdmin = email === PERMANENT_ADMIN_EMAIL.toLowerCase();

    // 1. Permanent Super Admin is always bound to Core Org
    if (isPermAdmin) {
      setCurrentOrg(DEFAULT_CORE_ORG);
      setIsOnboardingOpen(false);
      return;
    }

    // 2. Check if user is an existing admin of any organization
    const ownedOrg = organizations.find((o) => o.adminEmail.toLowerCase() === email);
    if (ownedOrg) {
      setCurrentOrg(ownedOrg);
      setIsOnboardingOpen(false);
      return;
    }

    // 3. Check if user's email was invited to an organization
    const matchingInvite = invites.find(
      (inv) => inv.email.toLowerCase().trim() === email
    );

    if (matchingInvite) {
      // User is logging in with an invited ID!
      const targetOrg = organizations.find((o) => o.id === matchingInvite.orgId) || DEFAULT_CORE_ORG;
      setCurrentOrg(targetOrg);
      setIsOnboardingOpen(false);

      // Apply assigned role and department on initial invite or first login
      if (matchingInvite.status === "pending" || !user.role) {
        assignUserRole(email, matchingInvite.role);
      }

      // If user has assigned projects, directly jump to the assigned project!
      if (matchingInvite.assignedProjectIds && matchingInvite.assignedProjectIds.length > 0) {
        const primaryProjectId = matchingInvite.assignedProjectIds[0];
        setAssignedProjectForCurrentLogin(primaryProjectId);
      }

      // Mark invite as accepted if still pending
      if (matchingInvite.status === "pending") {
        setInvites((prev) => {
          const updated = prev.map((inv) =>
            inv.id === matchingInvite.id ? { ...inv, status: "accepted" as const } : inv
          );
          if (typeof window !== "undefined") {
            localStorage.setItem("taskpulse_org_invites", JSON.stringify(updated));
          }
          return updated;
        });
      }
      return;
    }

    // 4. If internal demo user, keep in Core Org
    if (email.endsWith("@taskpulse.internal")) {
      setCurrentOrg(DEFAULT_CORE_ORG);
      setIsOnboardingOpen(false);
      return;
    }

    // 5. Authenticated user without custom organization:
    // Seamlessly connect to the active workspace with full access so user can explore projects and tasks
    const activeOrg = organizations[0] || DEFAULT_CORE_ORG;
    setCurrentOrg(activeOrg);
    setIsOnboardingOpen(false);
  }, [user?.email, organizations, invites]);

  // Onboard a new company as Admin
  const onboardCompany = (
    name: string,
    departments?: Department[] | Department,
    initialProjectName?: string,
    initialProjectCode?: string
  ) => {
    const adminEmail = user?.email || PERMANENT_ADMIN_EMAIL;
    const orgId = `org-${Date.now()}`;
    const cleanCode = (initialProjectCode || name.slice(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, "") || "PROJ";

    let resolvedDepts: Department[] = [];
    if (Array.isArray(departments)) {
      resolvedDepts = departments.filter(Boolean);
    } else if (typeof departments === "string" && departments.trim()) {
      resolvedDepts = [departments.trim()];
    }
    if (resolvedDepts.length === 0) {
      resolvedDepts = ["Operations", "Platform", "Product"];
    }
    const uniqueDepts = Array.from(new Set(resolvedDepts));

    const newOrg: Organization = {
      id: orgId,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      adminEmail,
      createdAt: new Date().toISOString(),
      departments: uniqueDepts,
      inviteCode: `${cleanCode}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const initialProject: Project = {
      id: `proj-${Date.now()}`,
      name: (initialProjectName || `${name.trim()} Core Roadmap`).trim(),
      code: cleanCode,
      department: uniqueDepts[0] || "General",
      description: `Primary initiative for ${name}`,
      progressPercentage: 0,
      targetDate: "Next 30 Days",
    };

    const updatedOrgs = [newOrg, ...organizations];
    setOrganizations(updatedOrgs);
    setCurrentOrg(newOrg);
    setIsOnboardingOpen(false);

    // Make the user Admin of their new company
    assignUserRole(adminEmail, "admin");

    // Automatically set active project to their new project
    setAssignedProjectForCurrentLogin(initialProject.id);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_organizations", JSON.stringify(updatedOrgs));
      localStorage.setItem("taskpulse_current_org_id", orgId);

      // Save initial project into custom projects
      const existingProjects = JSON.parse(localStorage.getItem("taskpulse_custom_projects") || "[]");
      localStorage.setItem(
        "taskpulse_custom_projects",
        JSON.stringify([initialProject, ...existingProjects])
      );
    }

    return { org: newOrg, initialProject };
  };

  // Join company with invite code
  const joinWithCode = (codeOrOrgId: string): { success: boolean; message: string; org?: Organization } => {
    const query = codeOrOrgId.trim().toUpperCase();
    const matched = organizations.find(
      (o) => o.inviteCode.toUpperCase() === query || o.id.toUpperCase() === query
    );

    if (!matched) {
      return { success: false, message: "Invalid invite code or organization ID." };
    }

    setCurrentOrg(matched);
    setIsOnboardingOpen(false);

    if (user?.email) {
      assignUserRole(user.email, "member");
    }

    return { success: true, message: `Successfully joined ${matched.name}!`, org: matched };
  };

  // Admin invites a teammate and assigns them to specific projects
  const inviteTeammate = (
    email: string,
    name: string,
    role: UserRole,
    department: Department,
    assignedProjectIds: string[]
  ): OrganizationInvite => {
    const newInvite: OrganizationInvite = {
      id: `inv-${Date.now()}`,
      orgId: currentOrg?.id || DEFAULT_CORE_ORG.id,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role,
      department,
      assignedProjectIds,
      invitedBy: user?.email || PERMANENT_ADMIN_EMAIL,
      invitedAt: new Date().toISOString(),
      status: "pending",
    };

    const updated = [newInvite, ...invites];
    setInvites(updated);

    // Also register the role so it is recognized
    assignUserRole(email.trim().toLowerCase(), role);

    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_org_invites", JSON.stringify(updated));
    }

    return newInvite;
  };

  const switchOrganization = (orgId: string) => {
    const found = organizations.find((o) => o.id === orgId);
    if (found) {
      setCurrentOrg(found);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_current_org_id", orgId);
      }
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrg,
        organizations,
        invites,
        isOnboardingOpen,
        setIsOnboardingOpen,
        assignedProjectForCurrentLogin,
        setAssignedProjectForCurrentLogin,
        onboardCompany,
        joinWithCode,
        inviteTeammate,
        switchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
};
