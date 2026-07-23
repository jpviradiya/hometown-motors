export type UserRole = "admin" | "customer" | string;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
