import { Todo } from "@/types/todo";
import instance from "@/lib/axios";

const axios = instance;

type CreateTodoPayload = {
  title: string;
  description: string;
};

const getAuthHeaders = () => { 
    const token = localStorage.getItem("token");
    return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

export const getTodos = async (): Promise<Todo[]> => {
   try {
    const res = await axios.get("/todos", getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error fetching todos:", err);
    throw err;
  }
};

export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
   try {
    const res = await axios.post("/todos/create", payload, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error creating todos:", err);
    throw err;
  }
};

export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
  
   try {
    const res = await axios.put(`/todos/${id}`, updates, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error("Error updating todos:", err);
    throw err;
  }
  
};

export const deleteTodo = async (id: string): Promise<void> => {
  
  try {
    await axios.delete(`/todos/${id}`, getAuthHeaders());
  } catch (err) {
    console.error("Error deleting todos:", err);
    throw err;
  }
};
