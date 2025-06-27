import axios, { AxiosError } from "axios";
import type {
  LoginDto,
  LoginResponse,
  RegistrationDto,
  RegistrationResponse,
} from "../interfaces/Auth";
import { useAuthStore } from "../store";

const API_URL = import.meta.env.VITE_API_URL;

class AuthController {
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }

    return AuthController.instance;
  }

  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  private getHeaders() {
    const token = this.getToken();
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  }

  public async login(data: LoginDto): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      const { success, message, token, user } = response.data;

      useAuthStore.getState().setToken(token);
      useAuthStore.getState().setUser(user);

      return { success, message, token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message || "Connexion echouée"
        );
      }
      throw new Error(
        "Une erreur s'est produite pendant le processus de connexion"
      );
    }
  }

  public async register(data: RegistrationDto): Promise<RegistrationResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      const { success, message } = response.data;

      return { success, message };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
          axiosError.response?.data?.message || "Connexion echouée"
        );
      }
      throw new Error(
        "Une erreur s'est produite pendant le processus de connexion"
      );
    }
  }

  public async logout(): Promise<void> {
    try {
      const token = this.getToken();

      if (token) {
        await axios.post(
          `${API_URL}/logout`,
          {},
          {
            headers: this.getHeaders(),
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      useAuthStore.getState().logout();
    }
  }
}

export const authController = AuthController.getInstance();
