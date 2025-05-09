export interface User {
  id?: number;
  username: string;
  email: string;
  password: string; // Hashed password
  created_at?: Date;
  updated_at?: Date;
}