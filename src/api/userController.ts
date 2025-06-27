import type {
  BasicResponse,
  JobResponse,
  User,
  UserResponse,
} from "../interfaces/User";
import apiService from "./api";

const BASE_URL = "/users";

class UserController {
  private static instance: UserController;

  private constructor() {}

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }

    return UserController.instance;
  }

  getUsers = (): Promise<UserResponse> => {
    return apiService.get<UserResponse>(`${BASE_URL}`);
  };

  getMe = (): Promise<User> => {
    return apiService.get<User>(`${BASE_URL}/me`);
  };

  updateInformations = ({
    data,
  }: {
    data: Record<string, any>;
  }): Promise<BasicResponse> => {
    return apiService.put<BasicResponse>(
      `${BASE_URL}/update-informations`,
      data
    );
  };

  getJobs = (): Promise<JobResponse> => {
    return apiService.get<JobResponse>(`${BASE_URL}/job`);
  };

  createJob = (name: string): Promise<BasicResponse> => {
    return apiService.post<BasicResponse>(`${BASE_URL}/job-create`, {
      name,
    });
  };
}

export const userController = UserController.getInstance();
