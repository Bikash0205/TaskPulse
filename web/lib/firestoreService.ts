import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { TaskPulseItem, ColleagueProfile, TaskStatus } from "@shared/types";
import { mockTasks, mockColleagues } from "@shared/mockData";

export const subscribeTasks = (
  onData: (tasks: TaskPulseItem[]) => void,
  fallbackData: TaskPulseItem[]
) => {
  if (!isFirebaseConfigured || !db) {
    onData(fallbackData);
    return () => {};
  }

  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef);

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onData(fallbackData);
      } else {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as TaskPulseItem[];
        onData(items);
      }
    },
    (err) => {
      console.warn("Firestore listener error, using fallback data:", err);
      onData(fallbackData);
    }
  );
};

export const createTaskDocument = async (task: TaskPulseItem): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  const taskRef = doc(db, "tasks", task.id);
  await setDoc(taskRef, {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateTaskStatusDocument = async (
  taskId: string,
  status: TaskStatus,
  progressPercentage?: number
): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  const taskRef = doc(db, "tasks", taskId);
  const payload: Record<string, any> = {
    status,
    updatedAt: serverTimestamp(),
  };
  if (typeof progressPercentage === "number") {
    payload.progressPercentage = progressPercentage;
  }
  await updateDoc(taskRef, payload);
};

export const updateTaskProgressDocument = async (
  taskId: string,
  progressPercentage: number
): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    progressPercentage,
    status: progressPercentage === 100 ? "completed" : undefined,
    updatedAt: serverTimestamp(),
  });
};
