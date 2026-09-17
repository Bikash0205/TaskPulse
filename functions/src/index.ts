import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

export const PERMANENT_ADMIN_EMAIL = "zevonbcash@gmail.com";

export type UserRole = "admin" | "manager" | "member";

export interface CustomClaimsPayload {
  role: UserRole;
  departmentId?: string;
  orgId: string;
}

/**
 * Triggered automatically upon first Google OAuth sign-in / Firebase user creation.
 * Provisions base user document in Firestore and sets default 'member' Custom Claim,
 * or permanent 'admin' role if the account is zevonbcash@gmail.com.
 */
export const onUserCreated = functions.auth.user.onCreated(async (event) => {
  const user = event.data;
  const uid = user.uid;
  const email = (user.email || "").toLowerCase().trim();
  const displayName = user.displayName || email.split("@")[0] || "Teammate";
  const photoURL = user.photoURL || "";

  // Enterprise domain verification & permanent Super Admin check
  const enterpriseOrgId = "taskpulse-global-corp";
  const isPermanentAdmin = email === PERMANENT_ADMIN_EMAIL.toLowerCase();
  const isSuperAdmin = isPermanentAdmin || (email.endsWith("@taskpulse.io") && email.startsWith("admin@"));

  const initialRole: UserRole = isSuperAdmin ? "admin" : "member";
  const initialDepartment = "Engineering"; // default assignment

  const claims: CustomClaimsPayload = {
    role: initialRole,
    departmentId: initialDepartment,
    orgId: enterpriseOrgId,
  };

  try {
    // 1. Set Auth Custom Claims for instant token validation in Security Rules
    await auth.setCustomUserClaims(uid, claims);

    // 2. Mirror metadata in Firestore users collection
    await db.collection("users").doc(uid).set(
      {
        uid,
        email,
        displayName,
        photoURL,
        role: initialRole,
        departmentId: initialDepartment,
        orgId: enterpriseOrgId,
        isPermanentAdmin,
        activeTaskCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // 3. Initialize real-time Colleague Pulse document
    await db.collection("colleague_pulse").doc(uid).set({
      userId: uid,
      displayName,
      avatarUrl: photoURL,
      department: initialDepartment,
      currentTaskTitle: "Awaiting Dispatch",
      projectBadge: isPermanentAdmin ? "ADMIN" : "ONBOARDING",
      progressPercentage: 0,
      activeTaskCount: 0,
      isBlocked: false,
      lastHeartbeat: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Successfully provisioned TaskPulse profile and claims for UID: ${uid} (Role: ${initialRole}, PermanentAdmin: ${isPermanentAdmin})`);
  } catch (error) {
    console.error(`Failed to initialize user ${uid}:`, error);
    throw new functions.https.HttpsError("internal", "Failed to assign initial role and claims.");
  }
});

/**
 * Callable Cloud Function to assign or elevate user roles.
 * Strictly prevents privilege escalation:
 * - Only administrators (primarily permanent admin zevonbcash@gmail.com) can assign roles.
 * - zevonbcash@gmail.com can NEVER be demoted or changed from admin.
 */
export const setUserRole = functions.https.onCall(async (request) => {
  const callerAuth = request.auth;
  if (!callerAuth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const callerEmail = (callerAuth.token.email || "").toLowerCase().trim();
  const callerClaims = callerAuth.token as unknown as CustomClaimsPayload;
  const callerRole = callerClaims.role;
  const callerDept = callerClaims.departmentId;
  const isCallerPermanentAdmin = callerEmail === PERMANENT_ADMIN_EMAIL.toLowerCase();

  const { targetUid, newRole, departmentId } = request.data as {
    targetUid: string;
    newRole: UserRole;
    departmentId: string;
  };

  if (!targetUid || !newRole || !["admin", "manager", "member"].includes(newRole)) {
    throw new functions.https.HttpsError("invalid-argument", "Valid targetUid and newRole are required.");
  }

  // Prevent demoting permanent admin
  try {
    const targetUserRecord = await auth.getUser(targetUid);
    const targetEmail = (targetUserRecord.email || "").toLowerCase().trim();
    if (targetEmail === PERMANENT_ADMIN_EMAIL.toLowerCase() && newRole !== "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        `Cannot demote permanent Super Admin ${PERMANENT_ADMIN_EMAIL}.`
      );
    }
  } catch (e: any) {
    if (e?.code === "functions/permission-denied") throw e;
  }

  // Caller permission check: Must be admin or the permanent admin
  if (callerRole !== "admin" && !isCallerPermanentAdmin) {
    if (callerRole === "manager") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Role management is reserved exclusively for the Super Admin."
      );
    } else {
      throw new functions.https.HttpsError("permission-denied", "Insufficient permissions to assign roles.");
    }
  }

  const updatedClaims: CustomClaimsPayload = {
    role: newRole,
    departmentId: departmentId || callerDept || "Engineering",
    orgId: callerClaims.orgId || "taskpulse-global-corp",
  };

  // Set custom user claims in Firebase Auth
  await auth.setCustomUserClaims(targetUid, updatedClaims);

  // Sync to Firestore user profile
  await db.collection("users").doc(targetUid).update({
    role: newRole,
    departmentId: updatedClaims.departmentId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    targetUid,
    assignedRole: newRole,
    departmentId: updatedClaims.departmentId,
  };
});
