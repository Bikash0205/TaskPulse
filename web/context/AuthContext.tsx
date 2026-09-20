"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  auth,
  db,
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

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isLiveFirebase: boolean;
  teamRoles: Record<string, UserRole>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
    department?: Department,
    initialRole?: UserRole
  ) => Promise<AuthResult>;
  signInWithCustomUser: (name: string, email: string, role?: UserRole) => void;
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
  const resolveRole = (
    email?: string | null,
    fallbackRole: UserRole = "member",
    currentRolesMap = teamRoles
  ): UserRole => {
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
            parsed.role = isPerm
              ? "admin"
              : (parsed.email ? (loadedRoles[parsed.email.toLowerCase().trim()] || parsed.role) : parsed.role);
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

    // 3. If Firebase credentials exist, listen to real Firebase Auth state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const isPerm = isPermanentAdminEmail(firebaseUser.email);
          let role: UserRole = isPerm ? "admin" : "member";
          let department: Department = "Engineering";

          // Read custom claims if set
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

          // Check Firestore user record if available
          if (db) {
            try {
              const userRef = doc(db, "users", firebaseUser.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                if (data.role && !isPerm) role = data.role as UserRole;
                if (data.department) department = data.department as Department;
              } else {
                await setDoc(
                  userRef,
                  {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || "Workspace Member",
                    role: isPerm ? "admin" : role,
                    department,
                    updatedAt: new Date().toISOString(),
                  },
                  { merge: true }
                );
              }
            } catch (err) {
              console.warn("Firestore user sync warning:", err);
            }
          }

          if (!isPerm && firebaseUser.email && loadedRoles[firebaseUser.email.toLowerCase().trim()]) {
            role = loadedRoles[firebaseUser.email.toLowerCase().trim()];
          }

          const loggedInUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || (isPerm ? "Zevon (Super Admin)" : "Workspace Member"),
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
        throw error;
      }
    } else {
      // Fallback
      signInWithCustomUser("Google Colleague", "colleague@workspace.internal");
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_signed_out");
    }
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        return { success: true };
      } catch (err: any) {
        console.warn("Firebase email sign-in error:", err.code, err.message);
        let message = "Authentication failed. Please verify your email and password.";
        if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
          message = "Incorrect password. Please verify and try again.";
        } else if (err.code === "auth/user-not-found") {
          message = "No account found with this email. Switch to 'Create Account' to register.";
        } else if (err.code === "auth/too-many-requests") {
          message = "Too many failed attempts. Please wait a moment or reset your password.";
        } else if (err.code === "auth/invalid-email") {
          message = "Please enter a valid work email address.";
        }
        return { success: false, error: message };
      }
    } else {
      // Offline / Demo fallback
      const isPerm = isPermanentAdminEmail(cleanEmail);
      const resolvedRole = isPerm ? "admin" : (teamRoles[cleanEmail] || "member");
      const namePart = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      signInWithCustomUser(formattedName, cleanEmail, resolvedRole);
      return { success: true };
    }
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
    department: Department = "Engineering",
    initialRole?: UserRole
  ): Promise<AuthResult> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_signed_out");
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const isPerm = isPermanentAdminEmail(cleanEmail);
    const targetRole: UserRole = isPerm ? "admin" : (initialRole || "member");

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (cred.user) {
          await updateProfile(cred.user, {
            displayName: cleanName,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              cleanName
            )}&background=${isPerm ? "7C3AED" : "756EF3"}&color=fff&size=128`,
          });
        }
        if (db && cred.user) {
          try {
            await setDoc(
              doc(db, "users", cred.user.uid),
              {
                uid: cred.user.uid,
                email: cleanEmail,
                displayName: cleanName,
                role: targetRole,
                department,
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e) {
            console.warn("Firestore user creation sync warning:", e);
          }
        }
        return { success: true };
      } catch (err: any) {
        console.warn("Firebase email signup error:", err.code, err.message);
        let message = "Account registration failed. Please try again.";
        if (err.code === "auth/email-already-in-use") {
          message = "An account with this email already exists. Switch to 'Sign In' instead.";
        } else if (err.code === "auth/weak-password") {
          message = "Password must be at least 6 characters.";
        } else if (err.code === "auth/invalid-email") {
          message = "Please enter a valid work email address.";
        }
        return { success: false, error: message };
      }
    } else {
      // Offline / Demo fallback
      signInWithCustomUser(cleanName, cleanEmail, targetRole);
      return { success: true };
    }
  };

  const signInWithCustomUser = (name: string, email: string, roleOverride?: UserRole) => {
    const isPerm = isPermanentAdminEmail(email);
    const resolvedRole: UserRole = isPerm
      ? "admin"
      : roleOverride || teamRoles[email.toLowerCase().trim()] || "member";

    const customUser: AppUser = {
      uid: isPerm ? "super-admin-zevon" : `user-${Date.now()}`,
      email: email || "user@workspace.internal",
      displayName: name || (isPerm ? "Zevon (Super Admin)" : "Workspace Member"),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || (isPerm ? "Zevon" : "User")
      )}&background=${isPerm ? "7C3AED" : "756EF3"}&color=fff&size=128`,
      role: isPerm ? "admin" : resolvedRole,
      department: "Engineering",
      isPermanentAdmin: isPerm,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_logged_user", JSON.stringify(customUser));
      localStorage.removeItem("taskpulse_signed_out");
      if (isPerm || roleOverride) {
        const updatedRoles = {
          ...teamRoles,
          [email.toLowerCase().trim()]: isPerm ? ("admin" as UserRole) : resolvedRole,
          [PERMANENT_ADMIN_EMAIL]: "admin" as UserRole,
        };
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
        signInWithEmail,
        signUpWithEmail,
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
