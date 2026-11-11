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
import { doc, getDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
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

export interface PendingGoogleProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  needsOnboarding?: boolean;
  googleProfile?: PendingGoogleProfile;
}

export interface AuthContextType {
  user: AppUser | null;
  pendingGoogleUser: PendingGoogleProfile | null;
  loading: boolean;
  isLiveFirebase: boolean;
  teamRoles: Record<string, UserRole>;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
    department?: Department,
    initialRole?: UserRole
  ) => Promise<AuthResult>;
  signInWithCustomUser: (name: string, email: string, role?: UserRole) => void;
  completeGoogleOnboarding: (
    displayName: string,
    role?: UserRole,
    department?: Department
  ) => Promise<AppUser | null>;
  clearPendingGoogleUser: () => Promise<void>;
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

export const PENDING_GOOGLE_STORAGE_KEY = "taskpulse_pending_google_auth";
export const REGISTERED_USERS_STORAGE_KEY = "taskpulse_registered_users";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<PendingGoogleProfile | null>(null);
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

  // Persist a user email/profile as having completed registration or workspace onboarding
  const recordRegisteredUser = (profile: {
    email?: string | null;
    uid?: string;
    role?: UserRole;
    department?: Department;
    displayName?: string | null;
    orgId?: string;
  }) => {
    if (typeof window === "undefined" || !profile.email) return;
    const cleanEmail = profile.email.toLowerCase().trim();
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(
        (item) => (typeof item === "string" ? item : item?.email)?.toLowerCase().trim() === cleanEmail
      );
      const entry = {
        email: cleanEmail,
        uid: profile.uid,
        role: profile.role || "member",
        department: profile.department || "Engineering",
        displayName: profile.displayName || "",
        orgId: profile.orgId,
        registeredAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        list[idx] = { ...(typeof list[idx] === "object" ? list[idx] : {}), ...entry };
      } else {
        list.push(entry);
      }
      localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to record registered user:", e);
    }
  };

  // Check whether an authenticated Google/email user already has a TaskPulse workspace account
  const checkUserProvisioned = async (
    email?: string | null,
    uid?: string
  ): Promise<{
    provisioned: boolean;
    role?: UserRole;
    department?: Department;
    displayName?: string;
    orgId?: string;
    assignedProjectIds?: string[];
  }> => {
    if (!email) return { provisioned: false };
    const cleanEmail = email.toLowerCase().trim();

    if (cleanEmail === PERMANENT_ADMIN_EMAIL.toLowerCase()) {
      return { provisioned: true, role: "admin", department: "Engineering", orgId: "org-core" };
    }

    if (cleanEmail.endsWith("@taskpulse.internal")) {
      return {
        provisioned: true,
        role: DEFAULT_TEAM_ROLES[cleanEmail] || "member",
        department: "Engineering",
        orgId: "org-core",
      };
    }

    // Authoritative check against live Firestore before trusting stale browser storage
    if (db) {
      try {
        const mapUserDoc = (data: Record<string, any>) =>
          data.onboardingComplete === true || Boolean(data.orgId)
            ? {
                provisioned: true,
                role: (data.role as UserRole) || "member",
                department: (data.department as Department) || "Engineering",
                displayName: data.displayName,
                orgId: data.orgId,
              }
            : null;

        if (uid) {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            const mapped = mapUserDoc(userSnap.data());
            if (mapped) return mapped;
          }
        } else {
          const userQSnap = await getDocs(query(collection(db, "users"), where("email", "==", cleanEmail)));
          if (!userQSnap.empty) {
            const mapped = mapUserDoc(userQSnap.docs[0].data());
            if (mapped) return mapped;
          }
        }

        const orgQ = query(collection(db, "organizations"), where("adminEmail", "==", cleanEmail));
        const orgSnap = await getDocs(orgQ);
        if (!orgSnap.empty) {
          const orgData = orgSnap.docs[0].data();
          return {
            provisioned: true,
            role: "admin",
            department: "Engineering",
            orgId: orgData.id || orgSnap.docs[0].id,
          };
        }

        const invQ = query(collection(db, "invites"), where("email", "==", cleanEmail));
        const invSnap = await getDocs(invQ);
        if (!invSnap.empty) {
          const invData = invSnap.docs[0].data();
          return {
            provisioned: true,
            role: (invData.role as UserRole) || "member",
            department: (invData.department as Department) || "Engineering",
            displayName: invData.name,
            orgId: invData.orgId,
            assignedProjectIds: invData.assignedProjectIds,
          };
        }

        // Live Firestore succeeded and found no matching user, org, or invite
        return { provisioned: false };
      } catch (err) {
        console.warn("Firestore provisioning lookup notice:", err);
      }
    }

    // Offline / unconfigured fallback only
    if (typeof window !== "undefined") {
      try {
        const regRaw = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
        if (regRaw) {
          const regList: any[] = JSON.parse(regRaw);
          const found = regList.find(
            (item) => (typeof item === "string" ? item : item?.email)?.toLowerCase().trim() === cleanEmail
          );
          if (found) {
            return {
              provisioned: true,
              role: (typeof found === "object" && found.role) || "member",
              department: (typeof found === "object" && found.department) || "Engineering",
              displayName: typeof found === "object" ? found.displayName : undefined,
              orgId: typeof found === "object" ? found.orgId : undefined,
            };
          }
        }

        const orgsRaw = localStorage.getItem("taskpulse_organizations");
        if (orgsRaw) {
          const orgsList: any[] = JSON.parse(orgsRaw);
          const ownedOrg = orgsList.find((o) => o?.adminEmail?.toLowerCase().trim() === cleanEmail);
          if (ownedOrg) {
            return { provisioned: true, role: "admin", department: "Engineering", orgId: ownedOrg.id };
          }
        }

        const invitesRaw = localStorage.getItem("taskpulse_org_invites");
        if (invitesRaw) {
          const invitesList: any[] = JSON.parse(invitesRaw);
          const matchedInvite = invitesList.find((inv) => inv?.email?.toLowerCase().trim() === cleanEmail);
          if (matchedInvite) {
            return {
              provisioned: true,
              role: matchedInvite.role || "member",
              department: matchedInvite.department || "Engineering",
              displayName: matchedInvite.name,
              orgId: matchedInvite.orgId,
              assignedProjectIds: matchedInvite.assignedProjectIds,
            };
          }
        }
      } catch (e) {
        console.warn("Local provisioning lookup warning:", e);
      }
    }

    return { provisioned: false };
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

      const savedPending = localStorage.getItem(PENDING_GOOGLE_STORAGE_KEY);
      if (savedPending) {
        try {
          const parsedPending = JSON.parse(savedPending);
          if (parsedPending?.email) {
            setPendingGoogleUser(parsedPending);
          }
        } catch {}
      }
    }

    // 1. Initial local restore (immediate only for internal/offline sessions; Firebase accounts wait for provisioning check)
    if (typeof window !== "undefined") {
      const isSignedOut = localStorage.getItem("taskpulse_signed_out") === "true";
      if (isSignedOut) {
        setUser(null);
        setLoading(false);
      } else {
        const savedUser = localStorage.getItem("taskpulse_logged_user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            const cleanEmail = (parsed?.email || "").toLowerCase().trim();
            const isInternalOrPerm =
              isPermanentAdminEmail(cleanEmail) || cleanEmail.endsWith("@taskpulse.internal");
            if (parsed && (parsed.email || parsed.displayName) && (!isFirebaseConfigured || !auth || isInternalOrPerm)) {
              const isPerm = isPermanentAdminEmail(parsed.email);
              parsed.role = isPerm
                ? "admin"
                : (parsed.email ? (loadedRoles[cleanEmail] || parsed.role) : parsed.role);
              parsed.isPermanentAdmin = isPerm;
              setUser(parsed);
              setLoading(false);
            }
          } catch (e) {
            console.warn("Failed to parse saved user", e);
          }
        }
      }
    }

    // 2. Real Firebase Auth state synchronization
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        const isSignedOut =
          typeof window !== "undefined" && localStorage.getItem("taskpulse_signed_out") === "true";

        if (firebaseUser && !isSignedOut) {
          const isPerm = isPermanentAdminEmail(firebaseUser.email);
          const status = await checkUserProvisioned(firebaseUser.email, firebaseUser.uid);

          if (!status.provisioned && !isPerm) {
            // New Google account that has never created an account / workspace:
            // Keep them in pendingGoogleUser so they complete Sign Up / Onboarding with locked email.
            const pendingProfile: PendingGoogleProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || null,
            };
            setPendingGoogleUser(pendingProfile);
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.setItem(PENDING_GOOGLE_STORAGE_KEY, JSON.stringify(pendingProfile));
              localStorage.removeItem("taskpulse_logged_user");
            }
            setLoading(false);
            return;
          }

          let role: UserRole = isPerm
            ? "admin"
            : status.role || (firebaseUser.email ? (loadedRoles[firebaseUser.email.toLowerCase().trim()] || "member") : "member");
          let department: Department = status.department || "Engineering";

          const loggedInUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: status.displayName || firebaseUser.displayName || (isPerm ? "Zevon (Super Admin)" : "Workspace Member"),
            photoURL:
              firebaseUser.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                firebaseUser.displayName || "User"
              )}&background=${isPerm ? "7C3AED" : "4285F4"}&color=fff`,
            role: isPerm ? "admin" : role,
            department,
            isPermanentAdmin: isPerm,
            orgId: status.orgId,
            assignedProjectIds: status.assignedProjectIds,
          };

          setPendingGoogleUser(null);
          setUser(loggedInUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("taskpulse_logged_user", JSON.stringify(loggedInUser));
            localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
            localStorage.removeItem("taskpulse_signed_out");
          }
          setLoading(false);

          // Asynchronous non-blocking claims sync for provisioned users
          (async () => {
            try {
              let updated = false;
              const idTokenResult = await firebaseUser.getIdTokenResult();
              if (idTokenResult.claims.role && !isPerm && idTokenResult.claims.role !== role) {
                role = idTokenResult.claims.role as UserRole;
                updated = true;
              }
              if (idTokenResult.claims.departmentId && idTokenResult.claims.departmentId !== department) {
                department = idTokenResult.claims.departmentId as Department;
                updated = true;
              }

              if (db) {
                const userRef = doc(db, "users", firebaseUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const data = userSnap.data();
                  if (data.role && !isPerm && data.role !== role) {
                    role = data.role as UserRole;
                    updated = true;
                  }
                  if (data.department && data.department !== department) {
                    department = data.department as Department;
                    updated = true;
                  }
                  if (data.displayName && data.displayName !== loggedInUser.displayName) {
                    loggedInUser.displayName = data.displayName;
                    updated = true;
                  }
                  if (data.orgId && data.orgId !== loggedInUser.orgId) {
                    loggedInUser.orgId = data.orgId;
                    updated = true;
                  }
                }
              }

              if (updated) {
                const enrichedUser: AppUser = {
                  ...loggedInUser,
                  role: isPerm ? "admin" : role,
                  department,
                };
                setUser(enrichedUser);
                if (typeof window !== "undefined") {
                  localStorage.setItem("taskpulse_logged_user", JSON.stringify(enrichedUser));
                }
              }
            } catch (err) {
              console.warn("Background claim/Firestore sync notice:", err);
            }
          })();
        } else {
          // No active Firebase session
          const isExplicitlySignedOut = typeof window !== "undefined" && localStorage.getItem("taskpulse_signed_out") === "true";
          if (isExplicitlySignedOut) {
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("taskpulse_logged_user");
            }
          } else if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("taskpulse_logged_user");
            if (savedUser) {
              try {
                const parsed = JSON.parse(savedUser);
                const cleanEmail = (parsed?.email || "").toLowerCase().trim();
                const isInternalOrPerm =
                  isPermanentAdminEmail(cleanEmail) || cleanEmail.endsWith("@taskpulse.internal");
                if (isInternalOrPerm) {
                  setUser(parsed);
                } else if (cleanEmail) {
                  const status = await checkUserProvisioned(cleanEmail, parsed?.uid);
                  if (status.provisioned) {
                    setUser({
                      ...parsed,
                      role: status.role || parsed.role,
                      department: status.department || parsed.department,
                      orgId: status.orgId || parsed.orgId,
                      assignedProjectIds: status.assignedProjectIds || parsed.assignedProjectIds,
                    });
                  } else {
                    setUser(null);
                    localStorage.removeItem("taskpulse_logged_user");
                    localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
                  }
                }
              } catch {
                setUser(null);
                localStorage.removeItem("taskpulse_logged_user");
              }
            }
          }
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async (): Promise<AuthResult> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_signed_out");
    }
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return { success: false, error: "Firebase authentication is not configured." };
    }

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        const isPerm = isPermanentAdminEmail(cred.user.email);
        const status = await checkUserProvisioned(cred.user.email, cred.user.uid);

        if (!status.provisioned && !isPerm) {
          // Brand-new Google user who has never signed up / onboarded:
          // Do not log into a dummy dashboard — send them to Sign Up / Onboarding with email locked.
          const googleProfile: PendingGoogleProfile = {
            uid: cred.user.uid,
            email: cred.user.email || "",
            displayName: cred.user.displayName || "",
            photoURL: cred.user.photoURL || null,
          };
          setPendingGoogleUser(googleProfile);
          setUser(null);
          if (typeof window !== "undefined") {
            localStorage.setItem(PENDING_GOOGLE_STORAGE_KEY, JSON.stringify(googleProfile));
            localStorage.removeItem("taskpulse_logged_user");
            localStorage.removeItem("taskpulse_signed_out");
          }
          return { success: true, needsOnboarding: true, googleProfile };
        }

        const initialRole: UserRole = isPerm
          ? "admin"
          : status.role || (teamRoles[cred.user.email?.toLowerCase().trim() || ""] || "member");

        const loggedInUser: AppUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: status.displayName || cred.user.displayName || (isPerm ? "Zevon (Super Admin)" : "Workspace Member"),
          photoURL:
            cred.user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              cred.user.displayName || "User"
            )}&background=${isPerm ? "7C3AED" : "4285F4"}&color=fff`,
          role: initialRole,
          department: status.department || "Engineering",
          isPermanentAdmin: isPerm,
          orgId: status.orgId,
          assignedProjectIds: status.assignedProjectIds,
        };

        recordRegisteredUser(loggedInUser);
        setPendingGoogleUser(null);
        setUser(loggedInUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("taskpulse_logged_user", JSON.stringify(loggedInUser));
          localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
          localStorage.removeItem("taskpulse_signed_out");
        }

        if (db) {
          setDoc(
            doc(db, "users", cred.user.uid),
            {
              uid: cred.user.uid,
              email: cred.user.email,
              displayName: loggedInUser.displayName,
              photoURL: cred.user.photoURL,
              role: initialRole,
              department: loggedInUser.department,
              orgId: status.orgId || null,
              onboardingComplete: true,
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((err) => console.warn("Background Firestore user sync:", err));
        }

        return { success: true, needsOnboarding: false };
      }
      return { success: true };
    } catch (error: any) {
      console.warn("Firebase Google Sign-In notice:", error?.code, error?.message);
      if (error?.code === "auth/popup-closed-by-user") {
        return { success: false, error: "Sign-in popup was closed before completing." };
      }
      if (error?.code === "auth/popup-blocked") {
        return {
          success: false,
          error: "Sign-in popup was blocked by the browser. Please allow popups for this site.",
        };
      }
      if (error?.code === "auth/unauthorized-domain") {
        const host = typeof window !== "undefined" ? window.location.hostname : "your domain";
        return {
          success: false,
          error: `Domain '${host}' is not authorized for Google Sign-In in Firebase Console (Authentication > Settings > Authorized domains).`,
        };
      }
      if (error?.code === "auth/operation-not-allowed") {
        return {
          success: false,
          error: "Google sign-in is not enabled in your Firebase Console. Please enable Google under Authentication > Sign-in method.",
        };
      }
      return { success: false, error: error?.message || "Google authentication failed." };
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("taskpulse_signed_out");
    }
    const cleanEmail = email.trim().toLowerCase();

    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        if (cred.user) {
          const isPerm = isPermanentAdminEmail(cred.user.email);
          const initialRole: UserRole = isPerm
            ? "admin"
            : (teamRoles[cleanEmail] || "member");

          const loggedInUser: AppUser = {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName || (isPerm ? "Zevon (Super Admin)" : cleanEmail.split("@")[0]),
            photoURL:
              cred.user.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                cleanEmail.split("@")[0]
              )}&background=${isPerm ? "7C3AED" : "756EF3"}&color=fff&size=128`,
            role: initialRole,
            department: "Engineering",
            isPermanentAdmin: isPerm,
          };

          recordRegisteredUser(loggedInUser);
          setPendingGoogleUser(null);
          setUser(loggedInUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("taskpulse_logged_user", JSON.stringify(loggedInUser));
            localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
            localStorage.removeItem("taskpulse_signed_out");
          }
        }
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
          try {
            await updateProfile(cred.user, {
              displayName: cleanName,
              photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                cleanName
              )}&background=${isPerm ? "7C3AED" : "756EF3"}&color=fff&size=128`,
            });
          } catch (profileErr) {
            console.warn("Profile update notice:", profileErr);
          }

          const loggedInUser: AppUser = {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cleanName,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              cleanName
            )}&background=${isPerm ? "7C3AED" : "756EF3"}&color=fff&size=128`,
            role: targetRole,
            department,
            isPermanentAdmin: isPerm,
          };

          recordRegisteredUser(loggedInUser);
          setUser(loggedInUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("taskpulse_logged_user", JSON.stringify(loggedInUser));
            localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
            localStorage.removeItem("taskpulse_signed_out");
          }
          setPendingGoogleUser(null);

          if (db) {
            setDoc(
              doc(db, "users", cred.user.uid),
              {
                uid: cred.user.uid,
                email: cleanEmail,
                displayName: cleanName,
                role: targetRole,
                department,
                onboardingComplete: true,
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            ).catch((e) => console.warn("Firestore user creation sync warning:", e));
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
    const cleanEmail = (email || "user@workspace.internal").toLowerCase().trim();
    const isPerm = isPermanentAdminEmail(cleanEmail);
    const resolvedRole: UserRole = isPerm
      ? "admin"
      : roleOverride || teamRoles[cleanEmail] || "member";

    const customUser: AppUser = {
      uid: isPerm ? "super-admin-zevon" : `user-${Date.now()}`,
      email: cleanEmail,
      displayName: name || (isPerm ? "Zevon (Super Admin)" : "Workspace Member"),
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || (isPerm ? "Zevon" : "User")
      )}&background=${isPerm ? "7C3AED" : "756EF3"}&color=fff&size=128`,
      role: isPerm ? "admin" : resolvedRole,
      department: "Engineering",
      isPermanentAdmin: isPerm,
    };

    recordRegisteredUser(customUser);
    setPendingGoogleUser(null);

    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_logged_user", JSON.stringify(customUser));
      localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
      localStorage.removeItem("taskpulse_signed_out");
      if (isPerm || roleOverride) {
        const updatedRoles = {
          ...teamRoles,
          [cleanEmail]: isPerm ? ("admin" as UserRole) : resolvedRole,
          [PERMANENT_ADMIN_EMAIL]: "admin" as UserRole,
        };
        setTeamRoles(updatedRoles);
        localStorage.setItem("taskpulse_team_roles", JSON.stringify(updatedRoles));
      }
    }
    setUser(customUser);
  };

  const completeGoogleOnboarding = async (
    displayName: string,
    role: UserRole = "admin",
    department: Department = "Engineering"
  ): Promise<AppUser | null> => {
    let activePending = pendingGoogleUser;
    if (!activePending && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(PENDING_GOOGLE_STORAGE_KEY);
        if (saved) activePending = JSON.parse(saved);
      } catch {}
    }

    const firebaseCurr = auth?.currentUser;
    const email = activePending?.email || firebaseCurr?.email || user?.email;
    if (!email) return null;

    const uid = activePending?.uid || firebaseCurr?.uid || user?.uid || `g-${Date.now()}`;
    const isPerm = isPermanentAdminEmail(email);
    const resolvedRole: UserRole = isPerm ? "admin" : role;
    const cleanName = displayName.trim() || activePending?.displayName || firebaseCurr?.displayName || email.split("@")[0];

    const completedUser: AppUser = {
      uid,
      email,
      displayName: cleanName,
      photoURL:
        activePending?.photoURL ||
        firebaseCurr?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=${
          isPerm ? "7C3AED" : "4285F4"
        }&color=fff`,
      role: resolvedRole,
      department,
      isPermanentAdmin: isPerm,
    };

    recordRegisteredUser(completedUser);
    setPendingGoogleUser(null);
    setUser(completedUser);

    if (typeof window !== "undefined") {
      localStorage.setItem("taskpulse_logged_user", JSON.stringify(completedUser));
      localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
      localStorage.removeItem("taskpulse_signed_out");
      const updatedRoles = {
        ...teamRoles,
        [email.toLowerCase().trim()]: resolvedRole,
        [PERMANENT_ADMIN_EMAIL]: "admin" as UserRole,
      };
      setTeamRoles(updatedRoles);
      localStorage.setItem("taskpulse_team_roles", JSON.stringify(updatedRoles));
    }

    if (firebaseCurr && cleanName && firebaseCurr.displayName !== cleanName) {
      updateProfile(firebaseCurr, { displayName: cleanName }).catch(() => {});
    }

    if (db) {
      try {
        await setDoc(
          doc(db, "users", uid),
          {
            uid,
            email: email.toLowerCase().trim(),
            displayName: cleanName,
            photoURL: completedUser.photoURL,
            role: resolvedRole,
            department,
            onboardingComplete: true,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Firestore onboarding profile save warning:", e);
      }
    }

    return completedUser;
  };

  const clearPendingGoogleUser = async () => {
    setPendingGoogleUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
    }
    if (isFirebaseConfigured && auth && !user) {
      try {
        await signOut(auth);
      } catch {}
    }
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
      localStorage.removeItem(PENDING_GOOGLE_STORAGE_KEY);
      localStorage.setItem("taskpulse_signed_out", "true");
    }
    setPendingGoogleUser(null);
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
        pendingGoogleUser,
        loading,
        isLiveFirebase: isFirebaseConfigured,
        teamRoles,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInWithCustomUser,
        completeGoogleOnboarding,
        clearPendingGoogleUser,
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
