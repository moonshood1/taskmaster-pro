import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store";
const API_URL = import.meta.env.VITE_API_URL;

class Api {
  private async request<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: any
  ): Promise<T> {
    try {
      const config = {
        method,
        url: `${API_URL}${url}`,
        headers: this.getHeaders(),
        ...(data && (method === "post" || method === "put") ? { data } : {}),
      };

      const response = await axios(config);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message);
      }
      throw new Error("Une erreur s'est produite lors de l'appel à l'API");
    }
  }

  public get<T>(url: string): Promise<T> {
    return this.request<T>("get", url);
  }

  public post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>("post", url, data);
  }

  public put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>("put", url, data);
  }

  public delete<T>(url: string): Promise<T> {
    return this.request<T>("delete", url);
  }

  private getHeaders(): Record<string, string> {
    const token = useAuthStore.getState().token ?? "";

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}

const apiService = new Api();
export default apiService;
