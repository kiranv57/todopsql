import AddTodo from "@/components/AddTodo"
import TodoList from "@/components/TodoList"
import { useTodoStore } from "@/store/todoStore";


const TodoDashboard = () => {

    const { error } = useTodoStore(); // Access Zustand store
    const todos = useTodoStore(state => state.todos); // Access Zustand store

    return (
        <div>
            <h1 className="text-center">Your Todos</h1>
            {error && <p className="error">{error}</p>}
            <AddTodo />
            <div className="mt-4 w-full ">
                <TodoList todos={todos}/>
            </div>
        </div>
    )
}

export default TodoDashboard
