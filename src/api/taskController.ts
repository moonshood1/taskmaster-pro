import type {
  BasicResponse,
  PriorityResponse,
  StatusResponse,
  TaskDto,
  TaskResponse,
} from "../interfaces/Task";
import apiService from "./api";

const BASE_URL = "/tasks";

class TaskController {
  private static instance: TaskController;

  private constructor() {}

  public static getInstance(): TaskController {
    if (!TaskController.instance) {
      TaskController.instance = new TaskController();
    }

    return TaskController.instance;
  }

  getTasks = ({ params }: { params: string }): Promise<TaskResponse> => {
    return apiService.get<TaskResponse>(`${BASE_URL}?${params}`);
  };

  createTask = ({ data }: { data: TaskDto }): Promise<BasicResponse> => {
    return apiService.post<BasicResponse>(`${BASE_URL}/create`, data);
  };

  updateTask = ({
    id,
    data,
  }: {
    id: string;
    data: Record<string, any>;
  }): Promise<BasicResponse> => {
    return apiService.put<BasicResponse>(`${BASE_URL}/update?id=${id}`, data);
  };

  deleteTask = ({ id }: { id: string }): Promise<BasicResponse> => {
    return apiService.delete<BasicResponse>(`${BASE_URL}/delete?id=${id}`);
  };

  attributeTask = ({
    id,
    assignedTo,
  }: {
    id: string;
    assignedTo: string | null;
  }): Promise<BasicResponse> => {
    return apiService.post<BasicResponse>(`${BASE_URL}/attribute?id=${id}`, {
      assignedTo,
    });
  };

  getPriorities = (): Promise<PriorityResponse> => {
    return apiService.get<PriorityResponse>(`${BASE_URL}/priorities`);
  };

  getStatuses = (): Promise<StatusResponse> => {
    return apiService.get<StatusResponse>(`${BASE_URL}/statuses`);
  };
}

export const taskController = TaskController.getInstance();
