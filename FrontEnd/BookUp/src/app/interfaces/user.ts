export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  is_active: boolean;
}

export interface UserUpdate {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}
