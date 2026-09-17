"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  saveFirebaseConfigAndReload,
  FirebaseCustomConfig,
} from "@/lib/firebase";
import { UserRole, Department } from "@shared/types";
import { mockColleagues } from "@shared/mockData";

export const PERMANENT_ADMIN_EMAIL = "zevonbcash@gmail.com";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  department: Department;
  isPermanentAdmin?: boolean;
  orgId?: string;
  assignedProjectIds?: string[];
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isLiveFirebase: boolean;
  teamRoles: Record<string, UserRole>;
  signInWithGoogle: () => Promise<void>;
  signInWithCustomUser: (name: string, email: string) => void;
  loginDemoUser: () => void;
  signOutUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  switchUser: (targetUser: AppUser) => void;
  connectFirebaseConfig: (config: FirebaseCustomConfig) => void;
  assignUserRole: (emailOrUid: string, role: UserRole) => boolean;
}

const DEFAULT_TEAM_ROLES: Record<string, UserRole> = {
  "zevonbcash@gmail.com": "admin",
  "sarah.chen@taskpulse.internal": "manager",
  "marcus.vance@taskpulse.internal": "member",
  "elena.rostova@taskpulse.internal": "member",
  "david.kim@taskpulse.internal": "member",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamRoles, setTeamRoles] = useState<Record<string, UserRole>>(DEFAULT_TEAM_ROLES);

  // Initial demo user template
  const defaultDemoUser: AppUser = {
    uid: mockColleagues[0].id,
    email: "sarah.chen@taskpulse.internal",
    displayName: mockColleagues[0].name,
    photoURL: mockColleagues[0].avatarUrl || null,
    role: "manager",
    department: "Engineering",
    isPermanentAdmin: false,
  };

  // Helper to determine if an email belongs to the permanent Super Admin
  const isPermanentAdminEmail = (email?: string | null): boolean => {
    return Boolean(email && email.toLowerCase().trim() === PERMANENT_ADMIN_EMAIL.toLowerCase());
  };

  // Helper to resolve the authoritative role for any email
  const resolveRole = (email?: string | null, fallbackRole: UserRole = "member", currentRolesMap = teamRoles): UserRole => {
    if (!email) return fallbackRole;
    const normalized = email.toLowerCase().trim();
    if (normalized === PERMANENT_ADMIN_EMAIL.toLowerCase()) {
      return "admin";
    }
    return currentRolesMap[normalized] || fallbackRole;
  };

  useEffect(() => {
    let loadedRoles = DEFAULT_TEAM_ROLES;
    if (typeof window !== "undefined") {
      const savedRoles = localStorage.getItem("taskpulse_team_roles");
      if (savedRoles) {
        try {
          const parsedRoles = JSON.parse(savedRoles);
          loadedRoles = { ...DEFAULT_TEAM_ROLES, ...parsedRoles, [PERMANENT_ADMIN_EMAIL]: "admin" };
          setTeamRoles(loadedRoles);
        } catch (e) {
          console.warn("Failed to parse team roles:", e);
        }
      }
    }

    // 1. Check if user explicitly signed out
    if (typeof window !== "undefined") {
      const isSignedOut = localStorage.getItem("taskpulse_signed_out") === "true";
      if (isSignedOut) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 2. Check if user logged in with a profile in this browser
      const savedUser = localStorage.getItem("taskpulse_logged_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && (parsed.email || parsed.displayName)) {
            const isPerm = isPermanentAdminEmail(parsed.email);
            parsed.role = isPerm ? "admin" : (parsed.email ? (loadedRoles[parsed.email.toLowerCase().trim()] || parsed.role) : parsed.role);
            parsed.isPermanentAdmin = isPerm;
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Failed to parse saved user", e);
        }
      }
    }

    // 3. If Firebase credentials exist, listen to real Google Auth state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const isPerm = isPermanentAdminEmail(firebaseUser.email);
          let role: UserRole = isPerm ? "admin" : "member";
          let department: Department = "Engineering";

          try {
            const idTokenResult = await firebaseUser.getIdTokenResult();
            if (idTokenResult.claims.role && !isPerm) {
              role = idTokenResult.claims.role as UserRole;
            }
            if (idTokenResult.claims.departmentId) {
              department = idTokenResult.claims.departmentId as Department;
            }
          } catch (err) {
            console.warn("Token claim error:", err);
          }

          if (!isPerm && firebaseUser.email && loadedRoles[firebaseUser.email.toLowerCase().trim()]) {
            role = loadedRoles[firebaseUser.email.toLowerCase().trim()];
          }

          const loggedInUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || (isPerm ? "Zevon (Super Admin)" : "Google User"),
            photoURL:
              firebaseUser.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                firebaseUser.displayName || "User"
              )}&background=${isPerm ? "7C3AED" : "4285F4"}&color=fff`,
            role: isPerm ? "admin" : role,
            department,
            isPermanentAdmin: isPerm,
          };

          setUser(loggedInUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("taskpulse_logged_user", JSON.stringify(loggedInUser));
            localStorage.removeItem("taskpulse_signed_out");
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Start clean with no mock user loaded
      setUser(null);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_signed_out");
    }
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error: any) {
        console.error("Firebase Google Sign-In error:", error);
        alert(`Google Sign-In notice: ${error.message}`);
      }
    } else {
      console.log("Firebase not yet configured with real API key.");
    }
  };

  const signInWithCustomUser = (name: string, email: string) => {
    const isPerm = isPermanentAdminEmail(email);
    const resolvedRole: UserRole = isPerm
      ? "admin"
      : teamRoles[email.toLowerCase().trim()] || "member";

    const customUser: AppUser = {
      uid: isPerm ? "super-admin-zevon" : `google-${Date.now()}`,
      email: email || "user@gmail.com",
      displayName: name || (isPerm ? "Zevon (Super Admin)" : "Google User"),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || (isPerm ? "Zevon" : "User")
      )}&background=${isPerm ? "7C3AED" : "4285F4"}&color=fff&size=128`,
      role: isPerm ? "admin" : resolvedRole,
      department: "Engineering",
      isPermanentAdmin: isPerm,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_logged_user", JSON.stringify(customUser));
      localStorage.removeItem("taskpulse_signed_out");
      if (isPerm) {
        const updatedRoles = { ...teamRoles, [PERMANENT_ADMIN_EMAIL]: "admin" as UserRole };
        setTeamRoles(updatedRoles);
        localStorage.setItem("taskpulse_team_roles", JSON.stringify(updatedRoles));
      }
    }
    setUser(customUser);
  };

  const loginDemoUser = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_logged_user", JSON.stringify(defaultDemoUser));
      localStorage.removeItem("taskpulse_signed_out");
    }
    setUser(defaultDemoUser);
  };

  const signOutUser = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Firebase signOut error:", e);
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_logged_user");
      localStorage.setItem("taskpulse_signed_out", "true");
    }
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    if (isPermanentAdminEmail(user.email)) {
      alert("zevonbcash@gmail.com is the Permanent Super Admin. Their admin role cannot be changed.");
      return;
    }
    const updated = { ...user, role: newRole };
    setUser(updated);
    if (user.email) {
      const updatedRoles = {
        ...teamRoles,
        [user.email.toLowerCase().trim()]: newRole,
        [PERMANENT_ADMIN_EMAIL]: "admin" as UserRole,
      };
      setTeamRoles(updatedRoles);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_team_roles", JSON.stringify(updatedRoles));
      }
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_logged_user", JSON.stringify(updated));
    }
  };

  const switchUser = (targetUser: AppUser) => {
    const isPerm = isPermanentAdminEmail(targetUser.email);
    const resolvedRole = isPerm ? "admin" : resolveRole(targetUser.email, targetUser.role);
    const updated = {
      ...targetUser,
      role: resolvedRole,
      isPermanentAdmin: isPerm,
    };
    setUser(updated);
  };

  const connectFirebaseConfig = (config: FirebaseCustomConfig) => {
    saveFirebaseConfigAndReload(config);
  };

  const assignUserRole = (emailOrUid: string, newRole: UserRole): boolean => {
    const normalized = emailOrUid.toLowerCase().trim();
    if (normalized === PERMANENT_ADMIN_EMAIL.toLowerCase()) {
      alert("zevonbcash@gmail.com is the Permanent Super Admin. Their admin privileges are permanent and cannot be modified.");
      return false;
    }

    const updatedRoles = {
      ...teamRoles,
      [normalized]: newRole,
      [PERMANENT_ADMIN_EMAIL]: "admin" as UserRole,
    };

    setTeamRoles(updatedRoles);
    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_team_roles", JSON.stringify(updatedRoles));
    }

    // If currently logged-in user matches target email, reflect immediately
    if (user && user.email?.toLowerCase().trim() === normalized) {
      const updatedUser: AppUser = { ...user, role: newRole };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("taskpulse_logged_user", JSON.stringify(updatedUser));
      }
    }

    return true;
  };

  const effectiveUser = user
    ? isPermanentAdminEmail(user.email)
      ? { ...user, role: "admin" as UserRole, isPermanentAdmin: true }
      : user
    : null;

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        loading,
        isLiveFirebase: isFirebaseConfigured,
        teamRoles,
        signInWithGoogle,
        signInWithCustomUser,
        loginDemoUser,
        signOutUser,
        switchRole,
        switchUser,
        connectFirebaseConfig,
        assignUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
