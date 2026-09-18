import { TaskPulseItem, Project } from "@shared/types";
import { mockTasks, mockProjects } from "@shared/mockData";

// Global persistent in-memory store across Next.js server invocations in development/runtime
declare global {
  // eslint-disable-next-line no-var
  var __taskPulseServerTasks: TaskPulseItem[] | undefined;
  // eslint-disable-next-line no-var
  var __taskPulseServerProjects: Project[] | undefined;
}

export function getServerTasks(): TaskPulseItem[] {
  if (!global.__taskPulseServerTasks) {
    global.__taskPulseServerTasks = [...mockTasks];
  }
  return global.__taskPulseServerTasks;
}

export function setServerTasks(tasks: TaskPulseItem[]) {
  global.__taskPulseServerTasks = tasks;
}

export function addOrUpdateServerTask(task: TaskPulseItem) {
  const current = getServerTasks();
  const index = current.findIndex((t) => t.id === task.id);
  if (index >= 0) {
    current[index] = { ...current[index], ...task, updatedAt: new Date().toISOString() };
  } else {
    current.unshift({
      ...task,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  global.__taskPulseServerTasks = current;
  return current;
}

export function getServerProjects(): Project[] {
  if (!global.__taskPulseServerProjects) {
    global.__taskPulseServerProjects = [...mockProjects];
  }
  return global.__taskPulseServerProjects;
}

export function addOrUpdateServerProject(project: Project) {
  const current = getServerProjects();
  const index = current.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    current[index] = { ...current[index], ...project };
  } else {
    current.unshift(project);
  }
  global.__taskPulseServerProjects = current;
  return current;
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
