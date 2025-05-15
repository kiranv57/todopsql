import React, {  useState } from "react";

import { Button } from "./ui/button";
import { useCreateTodo } from "@/hooks/todos/useCreateTodo";

const AddTodo: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const { create } = useCreateTodo();  



  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    try {
     
      create({title, description});
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