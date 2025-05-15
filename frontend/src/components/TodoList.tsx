import { useTodoStore } from "@/store/todoStore";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Todo } from "@/types/todo";
import { useDeleteTodo } from "@/hooks/todos/useDeleteTodo";
import { useUpdateTodo } from "@/hooks/todos/useUpdateTodo";

type editProps = {
  id: number;
  isEdit: boolean;
}

const TodoList: React.FC = () => {
  const { remove } = useDeleteTodo();
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  const [edit, setEdit] = React.useState<editProps | null>(null);
  const [edittitle, setEditTitle] = React.useState("");
  const [editdescription, setEditDescription] = React.useState("");
  const { update } = useUpdateTodo();

  const handleDelete = async (id: number) => {
    try {
      // deleteTodo(id); // Remove from store immediately (optimistic update)
      await remove(id.toString()); // Await backend deletion
      toast.success('todo deleted');
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo from backend");
    }
  };

  const handleEdit = async (id: number) => {
    setEdit({ id: id, isEdit: true ? false : true });
    const editTodo = todos.find((todo) => todo.id === id);
    if (editTodo) {
      setEditTitle(editTodo.title);
      setEditDescription(editTodo.description);
    }
  }

  const handleUpdate = async ({ edittitle, editdescription, id }: { edittitle: string, editdescription: string, id: number }) => { 
   
    const updatedTodo = {
      id: id,
      title: edittitle,
      description: editdescription
    };

    try {
      await update(id.toString(), updatedTodo); // Await backend update
      toast.success(`todo updated`);
      setEdit(null);
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo from backend");
    }
    
  
  }

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
      toast.info(`Todo updated in global store: ${todo.title}`);
      
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
            className={`p-2 mb-2 rounded bg-gray-200 flex justify-between items-center`}
          >
            <div>

              {edit && edit.id === todo.id ? (

                <>

                  <input type="text" className="bg-transparent" value={edittitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea className="bg-transparent" value={editdescription} onChange={(e) => setEditDescription(e.target.value)} />
                </>

              ) : (
                <>

                  <h3>{todo.title}</h3> <p className="text-sm">{todo.description}</p>
                </>
              )
              }


            </div>
            <div className="space-x-2">
              <Button
                variant={'secondary'}
                className="cursor-pointer"
                onClick={() => {
                  handleEdit(todo.id);
                }}
              >edit</Button>
              <Button
                variant={'secondary'}
                className="cursor-pointer"
                disabled={!edit || edit.id !== todo.id}
                onClick={() => {
                  handleUpdate({edittitle, editdescription, id: todo.id});
                }}
              >update</Button>
              <Button
                variant={'secondary'}
                className="cursor-pointer"
                onClick={() =>
                  handleDelete(todo.id)
                }
              >delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;