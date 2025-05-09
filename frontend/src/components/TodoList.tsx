import React from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
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