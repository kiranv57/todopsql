import React, {  useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

import { toast } from "react-toastify";

interface AddTodoProps {
  onTodoAdded: () => void; // Callback to refresh the todo list after adding a new todo
}

  
const AddTodo: React.FC<AddTodoProps> = ({ onTodoAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");



  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const token = localStorage.getItem("token"); // Get the JWT token from localStorage
      if (!token) {
        setError("You must be logged in to add a todo.");
        return;
      }

      // Send the new todo to the backend
        await axios.post(
        "http://localhost:5000/api/todos/create",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      
      // toast.success(`${res.data.todo} added successfully!`);
      setTitle("");
      setDescription("");
      // onTodoAdded(); // Refresh the todo list
    } catch (err: any) {
      console.error("Error adding todo:", err);
      setError(err.response?.data?.error || "Failed to add todo.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded shadow-md">
    
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddTodo} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className=" text-sm">Title:</label>
          <input
           className="border-2 border-gray-300 rounded p-2"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm">Description:</label>
          <textarea
            className="border-2 border-gray-300 rounded p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button className="primary text-2xl">Add to do</Button>
      </form>
    </div>
  );
};

export default AddTodo;