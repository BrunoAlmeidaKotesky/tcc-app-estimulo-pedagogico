import { NextResponse } from "next/server";
import { ZodError } from "zod";
import toast from "react-hot-toast";
import { DashboardDataItem } from "./types";

type EnvVariableKey = "JWT_SECRET_KEY" | "JWT_EXPIRES_IN";

export function getEnvVariable(key: EnvVariableKey): string {
  const value = process.env[key];

  if (!value || value.length === 0) {
    console.error(`The environment variable ${key} is not set.`);
    throw new Error(`The environment variable ${key} is not set.`);
  }

  return value;
}

export function getErrorResponse(
  status: number = 500,
  message: string,
  errors: ZodError | null = null
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message,
      errors: errors ? errors.flatten() : null,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function handleApiError(error: Error): void {
  try {
    let errorData;
    try {
      errorData = JSON.parse(error.message);
    } catch (parseError) {
      toast.error(error.message);
      return;
    }

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "fieldErrors" in errorData
    ) {
      const fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      Object.keys(fieldErrors).forEach((fieldName) => {
        const validationMessages = fieldErrors[fieldName];
        if (validationMessages.length > 0) {
          const firstValidationMessage = validationMessages[0];
          toast.error(firstValidationMessage);
        }
      });
    }
  } catch (error: any) {
    toast.error(error);
  }
}

export const extractDataBySubject = (data: DashboardDataItem[]) => {
  let result: { name: string; value: number }[] = [];

  data.forEach((item) => {
    for (let subject in item.exercisesGroupedBySubject) {
      const existingSubject = result.find((res) => res.name === subject);
      if (existingSubject) {
        existingSubject.value += item.exercisesGroupedBySubject[subject].length;
      } else {
        result.push({
          name: subject,
          value: item.exercisesGroupedBySubject[subject].length,
        });
      }
    }
  });

  return result;
};

export const extractDataByDifficulty = (data: DashboardDataItem[]) => {
  let result: { name: string; value: number }[] = [];

  data.forEach((item) => {
    for (let difficulty in item.exercisesGroupedByDifficulty) {
      const existingDifficulty = result.find((res) => res.name === difficulty);
      if (existingDifficulty) {
        existingDifficulty.value +=
          item.exercisesGroupedByDifficulty[difficulty].length;
      } else {
        result.push({
          name: difficulty,
          value: item.exercisesGroupedByDifficulty[difficulty].length,
        });
      }
    }
  });

  return result;
};

export function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
