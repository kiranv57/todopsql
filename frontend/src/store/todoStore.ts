import {create} from "zustand";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string;
  fetchTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  error: "",
  fetchTodos: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ error: "You must be logged in to view your todos.", loading: false });
        return;
      }

      set({ loading: true, error: "" });

      const response = await fetch("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch todos.");
      }

      const data = await response.json();
      set({ todos: data, loading: false });
    } catch (err: any) {
      console.error("Error fetching todos:", err);
      set({ error: err.message || "Failed to fetch todos.", loading: false });
    }
  },
}));