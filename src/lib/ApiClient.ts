import "reflect-metadata";
import { UserLoginResponse, UserResponse } from "./types";
import { Ok, Err, DefaultCatch } from "trentim-react-sdk/helpers";
import type { Result } from 'trentim-react-sdk/models';

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || "http://localhost:3000";

class ApiClient {

  private static async handleResponse<T>(response: Response): Promise<Result<T, Error>> {
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (isJson && data.errors !== null) {
        //@ts-ignore
        return Err(JSON.stringify(data.errors));
      }
      return Err(new Error(data.message || response.statusText));
    }
    return Ok(data as T);
  }

  @DefaultCatch(err => Err(err))
  public static async registerUser(credentials: string): Promise<Result<UserResponse, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: credentials,
    });
    return this.handleResponse<UserResponse>(response);
  }

  @DefaultCatch(err => Err(err))
  public static async loginUser(credentials: string): Promise<Result<UserLoginResponse, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: credentials,
    });
    const result = await this.handleResponse<UserLoginResponse>(response);
    return result;
  }

  @DefaultCatch(err => Err(err))
  public static async logoutUser(): Promise<Result<void, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse<void>(response);
  }

  @DefaultCatch(err => Err(err))
  public static async getAuthUser(token?: string): Promise<Result<UserResponse, Error>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${SERVER_ENDPOINT}/api/users/me`, {
      method: "GET",
      credentials: "include",
      headers,
    });
    const result = await this.handleResponse<UserResponse>(response);
    return result;
  }
}

export default ApiClient;
