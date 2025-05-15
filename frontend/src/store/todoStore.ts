import {create} from "zustand";

interface Todo {
  id: number;
  title: string;
  description: string;
}

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string;
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  // setTodos: (todo: Todo) => void; // Action to set todos
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
  // Action to set todos
  //  setTodos: (todo: Todo) => set((state) => ({ todos: [...state.todos, todo] })),
  addTodo: (todo) =>
    set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}));