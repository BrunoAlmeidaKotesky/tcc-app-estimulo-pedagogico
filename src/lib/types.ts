export interface FilteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoggedParent {
  user: FilteredUser;
  childAccessCodes: { name: string; accessCode: string }[];
}

export interface UserResponse<D> {
  status: string;
  data: D;
}

export interface UserLoginResponse {
  status: string;
  token: string;
}

export interface ChildUser {
  name: string;
  age: number;
  //Adicionar mais campos aqui conforme necessário.
}