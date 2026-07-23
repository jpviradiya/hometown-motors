import api from "./axios";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "../types/auth";

/**
 * Authenticates user credentials and returns JWT token.
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

/**
 * Registers a new user account.
 * Ensures 'name' field is sent for backend compatibility.
 */
export const register = async (data: RegisterRequest): Promise<void> => {
  const payload = {
    ...data,
    name: data.name || `${data.firstName} ${data.lastName}`.trim(),
  };
  await api.post("/auth/register", payload);
};

/**
 * Fetches current authenticated user profile using stored JWT.
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};
