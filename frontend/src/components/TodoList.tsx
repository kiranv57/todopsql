import { useTodoStore } from "@/store/todoStore";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// interface TodoListProps {
//   todos: Todo[];
// }

const TodoList: React.FC = () => {

  const {todos, addTodo, updateTodo, deleteTodo} = useTodoStore();  

  useEffect(() => {
   
    const socket = connectSocket(); // Establish the socket connection

    // Listen for todoCreated event
    socket.on("todoCreated", (todo) => {
      addTodo(todo);
      toast.success(`Todo created now: ${todo.title}`);
    });

    // Listen for todoUpdated event
    socket.on("todoUpdated", (todo: Todo) => {
      updateTodo(todo);
      toast.info(`Todo updated: ${todo.title}`);
    });

    // Listen for todoDeleted event
    socket.on("todoDeleted", ({ id }: { id: number }) => {
      deleteTodo(id); // Remove the deleted todo
      toast.error(`Todo deleted with ID: ${id}`);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("todoCreated");
      socket.off("todoUpdated");
      socket.off("todoDeleted");
      disconnectSocket(); // Disconnect the socket
    };
  }, []);

  return (
    console.log(todos),
    <div className="w-full bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Todos</h2>
      <ul>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className={`p-2 mb-2 rounded ${
              todo.completed ? "bg-green-200" : "bg-gray-200"
            }`}
          >
           <h3>{todo.title}</h3>
      
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;