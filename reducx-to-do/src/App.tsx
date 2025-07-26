import './App.css'
import AddToDo from './Components/AddToDo'
import Todos from './Components/Todos'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">To-Do List</h1>
        <AddToDo />
        <Todos />
      </div>
    </div>
  )
}

export default App