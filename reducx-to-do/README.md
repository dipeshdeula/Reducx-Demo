# React Redux Toolkit To-Do Application

A comprehensive guide to understanding React Redux Toolkit through a practical To-Do application built with React, TypeScript, and Tailwind CSS.

## 📚 Table of Contents

- [What is Redux Toolkit?](#what-is-redux-toolkit)
- [Why Use Redux Toolkit?](#why-use-redux-toolkit)
- [Core Concepts](#core-concepts)
- [Project Structure](#project-structure)
- [Step-by-Step Implementation](#step-by-step-implementation)
- [Data Flow Explanation](#data-flow-explanation)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## 🎯 What is Redux Toolkit?

Redux Toolkit (RTK) is the official, recommended way to write Redux logic. It's a set of tools and utilities that simplify Redux development by:

- **Reducing boilerplate code** - Less code to write and maintain
- **Providing good defaults** - Sensible configuration out of the box
- **Including useful utilities** - Built-in tools for common use cases
- **Enforcing best practices** - Guides you toward writing maintainable Redux code

### Key Features:
- `configureStore()` - Simplified store setup with good defaults
- `createSlice()` - Generates action creators and action types automatically
- `createAsyncThunk()` - Handles async logic (not used in this project)
- Immer integration - Write "mutative" logic that's actually immutable

## 🤔 Why Use Redux Toolkit?

### **State Management Challenges Without Redux:**
```jsx
// Without Redux - Props drilling nightmare
<App>
  <Header user={user} />
  <Main>
    <Sidebar user={user} />
    <Content>
      <TodoList todos={todos} onAdd={addTodo} onRemove={removeTodo} />
      <UserProfile user={user} />
    </Content>
  </Main>
</App>
```

### **With Redux - Centralized State:**
```jsx
// With Redux - Clean component tree
<App>
  <Header /> {/* Gets user from Redux store */}
  <Main>
    <Sidebar /> {/* Gets user from Redux store */}
    <Content>
      <TodoList /> {/* Gets todos from Redux store */}
      <UserProfile /> {/* Gets user from Redux store */}
    </Content>
  </Main>
</App>
```

### **Use Cases for Redux:**
- ✅ **Large applications** with complex state
- ✅ **Shared state** across many components
- ✅ **Time-travel debugging** requirements
- ✅ **Predictable state updates** needed
- ❌ **Simple apps** with local state only
- ❌ **Small projects** with minimal state sharing

## 🧩 Core Concepts

### 1. **Store** - The Single Source of Truth
The store holds the complete state tree of your application.

```typescript
// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";

export const store = configureStore({
    reducer: {
        todo: todoReducer  // 'todo' is the slice name
    }
})

// Type definitions for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

**What happens here?**
- `configureStore()` creates the Redux store
- `reducer` object defines how state is structured
- `todo: todoReducer` means our state will have a `todo` property
- TypeScript types help with type safety

### 2. **Slice** - Combines Actions and Reducers
A slice automatically generates action creators and action types based on reducer names.

```typescript
// src/features/todo/todoSlice.ts
import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the shape of our state
interface Todo {
    id: string;
    text: string;
}

interface TodoState {
    todos: Todo[];
}

// Initial state - what the state looks like when app starts
const initialState: TodoState = {
    todos: [{ id: '1', text: "Hello world" }]
}

export const todoSlice = createSlice({
    name: 'todo',  // This becomes the action type prefix
    initialState,
    reducers: {
        // Action creators are generated based on these names
        addTodo: (state, action: PayloadAction<string>) => {
            const todo: Todo = {
                id: nanoid(),  // Generate unique ID
                text: action.payload  // The data passed to the action
            }
            state.todos.push(todo)  // Immer makes this immutable behind the scenes
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
        }
    }
})

// Export actions (automatically generated)
export const { addTodo, removeTodo } = todoSlice.actions;

// Export reducer (the default export)
export default todoSlice.reducer;
```

**Key Points:**
- `name: 'todo'` creates action types like `todo/addTodo`, `todo/removeTodo`
- `PayloadAction<string>` means the action carries a string payload
- `nanoid()` generates unique IDs for todos
- Immer lets us write "mutative" code that's actually immutable

### 3. **Actions** - Describe What Happened
Actions are plain objects that describe changes to state.

```typescript
// Action structure (automatically generated by createSlice)
{
  type: 'todo/addTodo',        // Action type
  payload: 'Learn Redux'       // Data being passed
}

{
  type: 'todo/removeTodo',
  payload: 'todo-id-123'
}
```

### 4. **Reducers** - Specify How State Changes
Reducers are pure functions that specify how state changes in response to actions.

```typescript
// Reducer function signature
(state, action) => newState

// Example: How addTodo reducer works
addTodo: (state, action: PayloadAction<string>) => {
    // Current state: { todos: [...existing todos] }
    // Action: { type: 'todo/addTodo', payload: 'New todo text' }
    
    const todo = {
        id: nanoid(),
        text: action.payload
    }
    
    state.todos.push(todo)  // Add new todo to existing array
    
    // New state: { todos: [...existing todos, new todo] }
}
```

### 5. **Selectors** - Extract Data from State
Selectors are functions that extract specific pieces of state.

```typescript
// In component
import { useSelector } from 'react-redux'

const todos = useSelector((state: RootState) => state.todo.todos);
//                        ↑                    ↑      ↑
//                   Full state         Slice name  Property
```

### 6. **Dispatch** - Send Actions to Store
Dispatch is the only way to trigger state changes.

```typescript
// In component
import { useDispatch } from 'react-redux'
import { addTodo, removeTodo } from '../features/todo/todoSlice'

const dispatch = useDispatch();

// Dispatching actions
dispatch(addTodo('New todo text'))     // Adds todo
dispatch(removeTodo('todo-id-123'))    // Removes todo
```

## 📁 Project Structure

```
src/
├── app/
│   └── store.ts              # Redux store configuration
├── features/
│   └── todo/
│       └── todoSlice.ts      # Todo slice (actions + reducer)
├── Components/
│   ├── AddToDo.tsx          # Form to add new todos
│   └── Todos.tsx            # List of todos
├── App.tsx                  # Main app component
└── main.tsx                 # App entry point with Provider
```

## 🚀 Step-by-Step Implementation

### Step 1: Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux
```

### Step 2: Create the Store
```typescript
// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";

export const store = configureStore({
    reducer: {
        todo: todoReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Step 3: Create a Slice
```typescript
// src/features/todo/todoSlice.ts
import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Todo {
    id: string;
    text: string;
}

interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: []
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<string>) => {
            const todo: Todo = {
                id: nanoid(),
                text: action.payload
            }
            state.todos.push(todo)
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload)
        }
    }
})

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

### Step 4: Provide Store to App
```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>  {/* Makes store available to all components */}
    <App />
  </Provider>,
)
```

### Step 5: Use Redux in Components

#### Adding Todos Component:
```typescript
// src/Components/AddToDo.tsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../features/todo/todoSlice'

const AddToDo = () => {
    const [input, setInput] = useState("");
    const dispatch = useDispatch();  // Get dispatch function

    const addTodoHandler = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(addTodo(input))  // Dispatch action with input as payload
        setInput('')  // Clear input
    }

    return (
        <form onSubmit={addTodoHandler}>
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a Todo.."
            />
            <button type="submit">Add Todo</button>
        </form>
    )
}

export default AddToDo
```

#### Displaying Todos Component:
```typescript
// src/Components/Todos.tsx
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
    // Select todos from Redux state
    const todos = useSelector((state: RootState) => state.todo.todos);
    const dispatch = useDispatch();
    
    return (
        <div>
            {todos.map((todo) => (
                <div key={todo.id}>
                    <span>{todo.text}</span>
                    <button onClick={() => dispatch(removeTodo(todo.id))}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Todos
```

## 🔄 Data Flow Explanation

### The Redux Data Flow (Unidirectional):

```
┌─────────────┐    ┌──────────────┐    ┌───────────────┐    ┌─────────────┐
│   UI Event  │───▶│    Action    │───▶│    Reducer    │───▶│    State    │
│(Button Click)│    │(addTodo)     │    │(todoSlice)    │    │(Updated)    │
└─────────────┘    └──────────────┘    └───────────────┘    └─────────────┘
       ▲                                                              │
       │                                                              │
       └──────────────────────────────────────────────────────────────┘
                              UI Re-renders
```

### Detailed Flow for Adding a Todo:

1. **User Types and Clicks Submit**
   ```typescript
   // User action in AddToDo component
   const addTodoHandler = (e: React.FormEvent) => {
       e.preventDefault()
       dispatch(addTodo(input))  // 👈 This starts the flow
   }
   ```

2. **Action is Dispatched**
   ```typescript
   // Action object created automatically
   {
       type: 'todo/addTodo',
       payload: 'Learn Redux Toolkit'  // The user's input
   }
   ```

3. **Reducer Processes Action**
   ```typescript
   // todoSlice.ts - addTodo reducer
   addTodo: (state, action: PayloadAction<string>) => {
       const todo = {
           id: nanoid(),                    // Generate unique ID
           text: action.payload            // Use the dispatched text
       }
       state.todos.push(todo)              // Add to state array
   }
   ```

4. **State is Updated**
   ```typescript
   // Before: { todo: { todos: [{ id: '1', text: 'Hello world' }] } }
   // After:  { todo: { todos: [
   //           { id: '1', text: 'Hello world' },
   //           { id: '2', text: 'Learn Redux Toolkit' }
   //         ] } }
   ```

5. **Components Re-render**
   ```typescript
   // Todos component re-renders because todos state changed
   const todos = useSelector((state: RootState) => state.todo.todos);
   // Now includes the new todo!
   ```

### Flow for Removing a Todo:

1. **User Clicks Remove Button**
   ```typescript
   <button onClick={() => dispatch(removeTodo(todo.id))}>Remove</button>
   ```

2. **Action Dispatched**
   ```typescript
   {
       type: 'todo/removeTodo',
       payload: 'todo-id-to-remove'
   }
   ```

3. **Reducer Updates State**
   ```typescript
   removeTodo: (state, action: PayloadAction<string>) => {
       state.todos = state.todos.filter(todo => todo.id !== action.payload)
   }
   ```

4. **UI Updates Automatically**

## 🎯 Best Practices

### 1. **Structure Your State Properly**
```typescript
// ✅ Good - Normalized and flat
interface AppState {
    todos: {
        items: Todo[],
        loading: boolean,
        error: string | null
    },
    user: {
        profile: User | null,
        preferences: UserPreferences
    }
}

// ❌ Avoid - Deeply nested
interface BadState {
    app: {
        user: {
            todos: {
                personal: Todo[],
                work: Todo[]
            }
        }
    }
}
```

### 2. **Use TypeScript for Type Safety**
```typescript
// ✅ Always define interfaces
interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

// ✅ Type your payloads
PayloadAction<string>           // For simple data
PayloadAction<Todo>            // For objects
PayloadAction<{ id: string }>  // For specific shapes
```

### 3. **Keep Reducers Pure**
```typescript
// ✅ Good - Pure function
addTodo: (state, action) => {
    const todo = {
        id: nanoid(),
        text: action.payload
    }
    state.todos.push(todo)
}

// ❌ Bad - Side effects
addTodo: (state, action) => {
    const todo = {
        id: nanoid(),
        text: action.payload
    }
    state.todos.push(todo)
    
    // Don't do these in reducers:
    localStorage.setItem('todos', JSON.stringify(state.todos)) // ❌
    console.log('Todo added')                                  // ❌
    fetch('/api/todos', { method: 'POST', body: todo })       // ❌
}
```

### 4. **Use Descriptive Action Names**
```typescript
// ✅ Good - Clear and descriptive
addTodo
removeTodo
toggleTodoComplete
updateTodoText
clearCompletedTodos

// ❌ Bad - Vague or unclear
add
remove
toggle
update
clear
```

### 5. **Organize Features by Domain**
```
src/
├── features/
│   ├── todos/
│   │   ├── todoSlice.ts
│   │   ├── TodoList.tsx
│   │   └── AddTodo.tsx
│   ├── users/
│   │   ├── userSlice.ts
│   │   └── UserProfile.tsx
│   └── auth/
│       ├── authSlice.ts
│       └── LoginForm.tsx
```

## 🔧 Common Patterns

### 1. **Loading States**
```typescript
interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
}

const initialState: TodoState = {
    todos: [],
    loading: false,
    error: null
}

// In your slice
reducers: {
    fetchTodosStart: (state) => {
        state.loading = true;
        state.error = null;
    },
    fetchTodosSuccess: (state, action) => {
        state.loading = false;
        state.todos = action.payload;
    },
    fetchTodosFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }
}
```

### 2. **Conditional Rendering Based on State**
```typescript
const TodoList = () => {
    const { todos, loading, error } = useSelector((state: RootState) => state.todo);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (todos.length === 0) return <div>No todos yet!</div>;
    
    return (
        <div>
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </div>
    );
};
```

### 3. **Computed Values with Selectors**
```typescript
// Create reusable selectors
export const selectAllTodos = (state: RootState) => state.todo.todos;
export const selectCompletedTodos = (state: RootState) => 
    state.todo.todos.filter(todo => todo.completed);
export const selectActiveTodos = (state: RootState) => 
    state.todo.todos.filter(todo => !todo.completed);
export const selectTodoById = (state: RootState, todoId: string) =>
    state.todo.todos.find(todo => todo.id === todoId);

// Use in components
const completedTodos = useSelector(selectCompletedTodos);
const activeTodoCount = useSelector(selectActiveTodos).length;
```

## 🛠 Development Setup

### Installation
```bash
npm install
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Technologies Used
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 🎓 Key Takeaways

1. **Redux Toolkit simplifies Redux** - Less boilerplate, more productivity
2. **Unidirectional data flow** - Predictable state changes
3. **Actions describe what happened** - Clear intent
4. **Reducers specify how state changes** - Pure functions
5. **Single source of truth** - All state in one place
6. **TypeScript adds safety** - Catch errors at compile time
7. **Selectors extract data** - Reusable state access patterns

## 📝 Quick Reference

### Common Hooks
```typescript
import { useSelector, useDispatch } from 'react-redux';

// Get data from store
const todos = useSelector((state: RootState) => state.todo.todos);

// Dispatch actions
const dispatch = useDispatch();
dispatch(addTodo('New todo'));
```

### Slice Template
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
    // Define your state shape
}

const initialState: State = {
    // Initial values
};

const slice = createSlice({
    name: 'featureName',
    initialState,
    reducers: {
        actionName: (state, action: PayloadAction<PayloadType>) => {
            // Update state
        }
    }
});

export const { actionName } = slice.actions;
export default slice.reducer;
```

Remember: **Redux is about predictable state management**. Every state change happens through dispatched actions, making your app's behavior easy to debug and understand!
