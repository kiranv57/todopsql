import AddTodo from "@/components/AddTodo"
import TodoList from "@/components/TodoList"
import { useTodoStore } from "@/store/todoStore";


const TodoDashboard = () => {

    const { todos, error, fetchTodos } = useTodoStore(); // Access Zustand store
    
    return (
        <div>
            <h1 className="text-center">Your Todos</h1>
            {error && <p className="error">{error}</p>}
            <AddTodo onTodoAdded={fetchTodos} />
            <div className="mt-4 w-full ">
                <TodoList todos={todos} />
            </div>
        </div>
    )
}

export default TodoDashboard
