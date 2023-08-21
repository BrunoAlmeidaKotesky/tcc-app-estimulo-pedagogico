export interface FilteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  status: string;
  data: {
    user: FilteredUser;
    childAccessCodes: { name: string; accessCode: string }[];
  };
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