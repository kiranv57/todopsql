import { useState, useEffect } from "react";
import { getTodos } from "@/services/services"; 
import { Todo } from "@/types/todo";

export const useGetTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { todos, loading, error, refetch };
};
