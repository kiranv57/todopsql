export interface Todo {
  id: number;
  title: string;
  description: string;
  completed?: boolean; // Optional if not always present
  createdAt?: string;
  updatedAt?: string;
}