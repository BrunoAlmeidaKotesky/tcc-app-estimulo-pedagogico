import type { Answer, Exercise } from "@prisma/client";
import type {  } from 'trentim-react-sdk/models';

export interface FilteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export type UserType = 'parent' | 'child';
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

export interface ChildUser {
  name: string;
  age: number;
  //Adicionar mais campos aqui conforme necessário.
}

export interface ExerciseBody {
  exerciseId: string;
  childId: string;
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
  answers: Answer[];
}