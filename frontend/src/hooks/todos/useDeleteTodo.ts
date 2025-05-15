import { useState } from "react";
import { deleteTodo } from "@/services/services";

export const useDeleteTodo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteTodo(id);
      setError(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete todo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {remove, loading, error };
};
