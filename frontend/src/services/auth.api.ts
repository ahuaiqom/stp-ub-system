import { request } from "./api";

export interface AuthUser {
  userid: string;
  username: string;
  name: string;
  roles: Record<string, string[]>;
  pictureUri?: string;
}

export interface LoginResponse {
  accessToken: string;
  expDate: number;
  user: AuthUser;
}

export const apiLogin = (username: string, password: string) =>
  request<LoginResponse>("/auth/login", {
    method: "POST",
    body: { username, password },
    withCredentials: true,
  });

export const apiRefresh = () =>
  request<LoginResponse>("/auth/refresh", {
    method: "POST",
    withCredentials: true,
  });

export const apiLogout = (token: string) =>
  request<Record<string, never>>("/auth/logout", {
    method: "POST",
    token,
    withCredentials: true,
  });
