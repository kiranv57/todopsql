import React, { useEffect, useState } from "react";
import TodoList from "../components/TodoList";
import axios from "axios";
import AddTodo from "@/components/AddTodo";
import UserProfile from "@/components/UserProfile";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const UserFeed: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the JWT token from localStorage
      if (!token) {
        setError("You must be logged in to view your todos.");
        return;
      }
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      setTodos(response?.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching todos:", err);
      setError(err.response?.data?.error || "Failed to fetch todos.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
   
    <div className="flex min-h-screen bg-gray-100 flex items-stretch w-full "> 
    {/* Sidebar */}
    <div className="w-64 min-h-full sticky top-0">
      <UserProfile />
    </div>

    {/* Main Content */}
    <div className="flex-1 p-6 min-h-full ">
    <h1 className="text-center">Your Todos</h1>
      {error && <p className="error">{error}</p>}
      <AddTodo onTodoAdded={fetchTodos} />
      <div className="mt-4 w-full ">
      <TodoList todos={todos} />
      </div>
      
    </div>
  </div>
     
   
  );
};

export default UserFeed;