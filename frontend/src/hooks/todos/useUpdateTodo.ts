import { useState } from "react";
import { updateTodo} from "@/services/services"; 
import { Todo } from "@/types/todo";

export const useUpdateTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, updates: Partial<Todo>): Promise<Todo | null> => {
    setLoading(true);
    try {
      const updated = await updateTodo(id, updates);
      setError(null);
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update todo");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};
