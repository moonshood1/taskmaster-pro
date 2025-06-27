export interface Job {
  _id: string;
  name: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobDto {
  name: string;
}

export interface JobResponse {
  success: boolean;
  data: Job[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  job?: Pick<Job, "_id" | "name">;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
}

export interface BasicResponse {
  success: boolean;
  message: string;
}
