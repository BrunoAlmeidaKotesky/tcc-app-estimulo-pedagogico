import type { Answer, Child, Exercise } from "@prisma/client";

export interface FilteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type UserType = "parent" | "child";
export interface LoggedParent {
  user: FilteredUser;
  childAccessCodes: { name: string; accessCode: string }[];
}

export interface UserResponse<D> {
  status: string;
  data: D;
  userType: UserType;
}

export interface UserLoginResponse {
  status: string;
  token: string;
  userType: UserType;
}

export type ChildUser = Pick<Child, "id" | "name" | "points" | "age">;

export interface ExerciseBody {
  exerciseId: string;
  answerId: string;
}

export interface BadgeBody {
  userType: UserType;
}

export type BadgeData = {
  badgeId: string;
  badge: {
    name: string;
    icon: string | null;
    criteria: string;
    threshold: number;
  };
};
export interface BadgeResponse {
  earnedBadges: BadgeData[];
  allBadges: BadgeData[];
}

export interface AnswerByExercise {
  exercise: Exercise;
  answers: Omit<Answer, "isCorrect">[];
}

export interface SendAnswerResponse {
  isRightAnswer: boolean;
  newPoints: number;
}

export type Updater<T> = (value: T | ((prev: T) => T)) => void;

export type BaseDataItem = {
  isCorrect: boolean;
  exerciseId: string;
};

export type DataByDifficulty = BaseDataItem & {
  subjectName: string;
};
export type DataBySubject = BaseDataItem & {
  difficulty: string;
};

export type ExerciseDataItem = DataByDifficulty | DataBySubject;
export type GroupedUnion = DataByDifficulty & DataBySubject;
export type GroupedByDifficulty = {
  [key: string]: ExerciseDataItem[];
};

export type GroupedBySubject = {
  [key: string]: ExerciseDataItem[];
};

export type DashboardDataItem = {
  name: string;
  points: number;
  exercisesGroupedBySubject: GroupedBySubject;
  exercisesGroupedByDifficulty: GroupedByDifficulty;
};
