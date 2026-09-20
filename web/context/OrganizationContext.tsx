"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Organization, OrganizationInvite, UserRole, Department, Project } from "@shared/types";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  ) => Promise<{ org: Organization; initialProject: Project }>;
  joinWithCode: (codeOrOrgId: string) => Promise<{ success: boolean; message: string; org?: Organization }>;
  inviteTeammate: (
    email: string,
    name: string,
    role: UserRole,
    department: Department,
    assignedProjectIds: string[]
  ) => Promise<OrganizationInvite>;
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

  // Load saved organizations and invites from localStorage and Firestore on mount
  useEffect(() => {
    let localOrgs = [DEFAULT_CORE_ORG];
    let localInvites = DEFAULT_INVITES;

    if (typeof window !== "undefined") {
      const savedOrgs = localStorage.getItem("taskpulse_organizations");
      if (savedOrgs) {
        try {
          const parsed = JSON.parse(savedOrgs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localOrgs = parsed;
            setOrganizations(parsed);
          }
        } catch (e) {}
      }

      const savedInvites = localStorage.getItem("taskpulse_org_invites");
      if (savedInvites) {
        try {
          const parsed = JSON.parse(savedInvites);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localInvites = parsed;
            setInvites(parsed);
          }
        } catch (e) {}
      }
    }

    // Attempt Firestore sync if db is initialized
    if (db) {
      const fetchFirestoreData = async () => {
        try {
          const orgsCol = collection(db!, "organizations");
          const orgSnap = await getDocs(orgsCol);
          if (!orgSnap.empty) {
            const firestoreOrgs: Organization[] = [];
            orgSnap.forEach((d) => firestoreOrgs.push(d.data() as Organization));
            // Merge preserving uniqueness
            const merged = [...firestoreOrgs];
            localOrgs.forEach((lo) => {
              if (!merged.some((m) => m.id === lo.id)) merged.push(lo);
            });
            setOrganizations(merged);
            if (typeof window !== "undefined") {
              localStorage.setItem("taskpulse_organizations", JSON.stringify(merged));
            }
          }

          const invitesCol = collection(db!, "invites");
          const invSnap = await getDocs(invitesCol);
          if (!invSnap.empty) {
            const firestoreInvites: OrganizationInvite[] = [];
            invSnap.forEach((d) => firestoreInvites.push(d.data() as OrganizationInvite));
            const mergedInvites = [...firestoreInvites];
            localInvites.forEach((li) => {
              if (!mergedInvites.some((m) => m.id === li.id)) mergedInvites.push(li);
            });
            setInvites(mergedInvites);
            if (typeof window !== "undefined") {
              localStorage.setItem("taskpulse_org_invites", JSON.stringify(mergedInvites));
            }
          }
        } catch (err) {
          console.warn("Firestore organization load notice:", err);
        }
      };
      fetchFirestoreData();
    }
  }, []);

  // Validate user organization membership upon login
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
      const targetOrg = organizations.find((o) => o.id === matchingInvite.orgId) || DEFAULT_CORE_ORG;
      setCurrentOrg(targetOrg);
      setIsOnboardingOpen(false);

      if (matchingInvite.status === "pending" || !user.role) {
        assignUserRole(email, matchingInvite.role);
      }

      if (matchingInvite.assignedProjectIds && matchingInvite.assignedProjectIds.length > 0) {
        setAssignedProjectForCurrentLogin(matchingInvite.assignedProjectIds[0]);
      }

      if (matchingInvite.status === "pending") {
        setInvites((prev) => {
          const updated = prev.map((inv) =>
            inv.id === matchingInvite.id ? { ...inv, status: "accepted" as const } : inv
          );
          if (typeof window !== "undefined") {
            localStorage.setItem("taskpulse_org_invites", JSON.stringify(updated));
          }
          if (db) {
            setDoc(doc(db, "invites", matchingInvite.id), { status: "accepted" }, { merge: true }).catch(() => {});
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

    // 5. Default fallback to current or core
    if (!currentOrg) {
      setCurrentOrg(DEFAULT_CORE_ORG);
    }
  }, [user?.email, organizations, invites]);

  // Onboard a new company as Admin
  const onboardCompany = async (
    name: string,
    departments?: Department[] | Department,
    initialProjectName?: string,
    initialProjectCode?: string
  ): Promise<{ org: Organization; initialProject: Project }> => {
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

    assignUserRole(adminEmail, "admin");
    setAssignedProjectForCurrentLogin(initialProject.id);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_organizations", JSON.stringify(updatedOrgs));
      localStorage.setItem("taskpulse_current_org_id", orgId);

      const existingProjects = JSON.parse(localStorage.getItem("taskpulse_custom_projects") || "[]");
      localStorage.setItem(
        "taskpulse_custom_projects",
        JSON.stringify([initialProject, ...existingProjects])
      );
    }

    // Save to Firestore if available
    if (db) {
      try {
        await setDoc(doc(db, "organizations", orgId), newOrg);
        await setDoc(doc(db, "projects", initialProject.id), initialProject);
      } catch (err) {
        console.warn("Firestore onboard sync warning:", err);
      }
    }

    return { org: newOrg, initialProject };
  };

  // Join company with invite code
  const joinWithCode = async (
    codeOrOrgId: string
  ): Promise<{ success: boolean; message: string; org?: Organization }> => {
    const query = codeOrOrgId.trim().toUpperCase();
    let matched = organizations.find(
      (o) => o.inviteCode.toUpperCase() === query || o.id.toUpperCase() === query
    );

    // Query Firestore fallback if not in local memory
    if (!matched && db) {
      try {
        const orgsCol = collection(db, "organizations");
        const orgSnap = await getDocs(orgsCol);
        orgSnap.forEach((d) => {
          const orgData = d.data() as Organization;
          if (orgData.inviteCode?.toUpperCase() === query || orgData.id?.toUpperCase() === query) {
            matched = orgData;
          }
        });
        if (matched) {
          setOrganizations((prev) => [matched!, ...prev]);
        }
      } catch (err) {
        console.warn("Firestore lookup error:", err);
      }
    }

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
  const inviteTeammate = async (
    email: string,
    name: string,
    role: UserRole,
    department: Department,
    assignedProjectIds: string[]
  ): Promise<OrganizationInvite> => {
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

    assignUserRole(email.trim().toLowerCase(), role);

    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_org_invites", JSON.stringify(updated));
    }

    if (db) {
      try {
        await setDoc(doc(db, "invites", newInvite.id), newInvite);
      } catch (err) {
        console.warn("Firestore invite sync warning:", err);
      }
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
