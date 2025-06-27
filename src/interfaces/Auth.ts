import type { Job } from "./User";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    job: string;
    createdAt: string;
  };
}

export interface RegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  job: Job["_id"];
}

export interface RegistrationResponse {
  message: string;
  success: boolean;
}
