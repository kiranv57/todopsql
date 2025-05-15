import { useState } from "react";
import { createTodo} from "@/services/services"; 
import { Todo } from "@/types/todo";

export const useCreateTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: { title: string, description: string }): Promise<Todo | null> => {
    setLoading(true);
    try {
      const newTodo = await createTodo(payload);
      setError(null);
      return newTodo;
    } catch (err: any) {
      setError(err.message || "Failed to create todo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};
