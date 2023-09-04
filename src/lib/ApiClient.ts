import "reflect-metadata";
import type { AnswerByExercise, ExerciseBody, LoggedParent, SendAnswerResponse, UserLoginResponse, UserResponse } from "./types";
import { Ok, Err, DefaultCatch, Result } from "bakutils-catcher";

const SERVER_ENDPOINT = process.env.SERVER_ENDPOINT || "http://localhost:3000";
const headers: Record<string, string> = {
  "Content-Type": "application/json",
}

/**Esse código ta meio que muito repetitivo, dá pra reduzir */
class ApiClient {

  public static async handleResponse<T>(response: Response): Promise<Result<T, Error>> {
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();
    if (!response.ok) {
      console.log(data, response);
      if (isJson && data.errors !== null && data.errors !== undefined) {
        console.log("Caiu no erro new Error(data.errors)");
        //@ts-ignore
        return Err(new Error(data.errors));
      }
      console.log("Caiu no erro data.message || response.statusText");
      return Err(new Error(data.message || response.statusText));
    }
    return Ok(data as T);
  }

  @DefaultCatch(err => Err(err))
  public static async registerUser(credentials: string): Promise<Result<UserResponse<LoggedParent>, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers,
      body: credentials,
    });
    return this.handleResponse<UserResponse<LoggedParent>>(response);
  }

  @DefaultCatch(err => Err(err))
  public static async loginParentUser(credentials: string): Promise<Result<UserLoginResponse, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/parent-login`, {
      method: "POST",
      credentials: "include",
      headers,
      body: credentials,
    });
    const result = await this.handleResponse<UserLoginResponse>(response);
    return result;
  }

  @DefaultCatch(err => Err(err))
  public static async loginChildUser(accessCode: string, name: string): Promise<Result<UserLoginResponse, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/child-login`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ accessCode, name }),
    });
    const result = await this.handleResponse<UserLoginResponse>(response);
    return result;
  }

  @DefaultCatch(err => Err(err))
  public static async logoutUser(): Promise<Result<void, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers,
    });
    return this.handleResponse<void>(response);
  }

  @DefaultCatch(err => Err(err))
  public static async getAuthUser<T>(type: 'parent' | 'child', token?: string): Promise<Result<UserResponse<T>, Error>> {
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${SERVER_ENDPOINT}/api/users/${type}`, {
      method: "GET",
      credentials: "include",
      headers,
    });
    const result = await this.handleResponse<UserResponse<T>>(response);
    return result;
  }

  @DefaultCatch(err => Err(err))
  public static async getDailyExercises(token: string): Promise<Result<AnswerByExercise[], Error>> {
    console.log(token);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${SERVER_ENDPOINT}/api/get-exercises`, {
      method: "GET",
      credentials: "include",
      cache: 'no-store',
      headers
    });
    const result = await this.handleResponse<AnswerByExercise[]>(response);
    return result;
  }

  @DefaultCatch(err => Err(err))
  public static async sendAnswer(body: ExerciseBody): Promise<Result<SendAnswerResponse, Error>> {
    const response = await fetch(`${SERVER_ENDPOINT}/api/send-exercise`, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
      headers
    });
    const result = await this.handleResponse<SendAnswerResponse>(response);
    return result;
  }

}

export default ApiClient;