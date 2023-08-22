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
  userType: 'parent' | 'child';
}

export interface UserLoginResponse {
  status: string;
  token: string;
  userType: 'parent' | 'child';
}

export interface ChildUser {
  name: string;
  age: number;
  //Adicionar mais campos aqui conforme necessário.
}