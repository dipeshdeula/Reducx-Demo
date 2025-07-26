import { useSelector, useDispatch } from 'react-redux'
import { removeTodo } from '../features/todo/todoSlice'

interface Todo {
  id: string;
  text: string;
}

interface RootState {
  todo: {
    todos: Todo[];
  };
}

const Todos = () => {
  const todos = useSelector((state: RootState) => state.todo.todos);
  const dispatch = useDispatch();
  
  return (
    <div className="mt-8">
      <div className="text-xl mb-4">Todos</div>
      {todos.map((todo) => (
        <div 
          key={todo.id} 
          className="flex items-center justify-between bg-gray-800 p-4 rounded mb-2"
        >
          <span className="text-white">{todo.text}</span>
          <button 
            onClick={() => dispatch(removeTodo(todo.id))}
            className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded"
          >
            X
          </button>
        </div>
      ))}
    </div>
  )
}

export default Todos