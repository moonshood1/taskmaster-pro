import type { User } from "./User";

export interface Priority {
  _id: string;
  name: string;
  level: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriorityResponse {
  success: boolean;
  data: Priority[];
}

export interface Status {
  _id: string;
  label: string;
  color: string;
}

export interface StatusResponse {
  success: boolean;
  data: Status[];
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  creator: Pick<User, "_id" | "firstName" | "lastName">;
  status: Pick<Status, "_id" | "color" | "label">;
  priority: Pick<Priority, "_id" | "name" | "color">;
  assignedTo: Pick<User, "_id" | "firstName" | "lastName"> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskResponse {
  success: boolean;
  data: Task[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TaskDto {
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assignedTo: string | null;
}

export interface BasicResponse {
  success: boolean;
  message: string;
}
