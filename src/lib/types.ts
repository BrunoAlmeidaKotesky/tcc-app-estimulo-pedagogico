import { Badge, EarnedBadge } from "@prisma/client";

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

export interface BadgeResponse {
  earnedBadges: EarnedBadge[];
  allBadges: Badge[];
}