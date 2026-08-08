import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8094/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Fetch from Java Backend
  useEffect(() => {
    axios.get(API_URL)
     .then(res => setTodos(res.data))
     .catch(() => {
        // If backend not running, use local storage fallback
        const saved = localStorage.getItem("todos");
        if (saved) setTodos(JSON.parse(saved));
      });
  }, []);

  // Save to localStorage backup
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(API_URL, { title: text, completed: false });
      setTodos([...todos, res.data]);
    } catch {
      // Fallback if backend off
      setTodos([...todos, { id: Date.now(), title: text, completed: false }]);
    }
    setText("");
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    try {
      const res = await axios.put(`${API_URL}/${id}`, {...todo, completed:!todo.completed });
      setTodos(todos.map(t => t.id === id? res.data : t));
    } catch {
      setTodos(todos.map(t => t.id === id? {...t, completed:!t.completed } : t));
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch {}
    setTodos(todos.filter(t => t.id!== id));
  };

  return (
    <div className="app">
      <h1>✅ Full Stack Todo - React + Java</h1>
      <p>Backend: localhost:8094 | Project 53</p>
      <div className="input-area">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add new task..." onKeyDown={e => e.key === 'Enter' && addTodo()} />
        <button onClick={addTodo}>Add</button>
      </div>
      <p>Total: {todos.length} | Done: {todos.filter(t => t.completed).length}</p>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed? "done" : ""}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.title || todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;